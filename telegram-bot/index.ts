require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
const {
  getScales,
  getCategories,
  searchScales,
} = require("./src/scales");

const bot = new Telegraf(process.env.BOT_TOKEN);
const sessions = {};
function sendQuestion(ctx, scale, index) {
  const question = scale.questions[index];
  if (question.type === "number") {
    sessions[ctx.from.id].waitingNumber = true;
    sessions[ctx.from.id].currentQuestion = index;

    return ctx.reply(
      `🏥 ${scale.fullName || scale.name}\n\n📍 Pregunta ${index + 1}/${scale.questions.length}\n\n${question.label || question.text}\n\n✍️ Escribe un número:`
    );
  }

  const buttons = question.options.map((option) => [
    Markup.button.callback(
      option.label,
      `answer_${scale.id}_${index}_${option.score}`
    ),
  ]);

  ctx.reply(
    `🏥 ${scale.fullName || scale.name}\n\n📍 Pregunta ${index + 1}/${scale.questions.length}\n\n${question.text}`,
    Markup.inlineKeyboard(buttons)
  );
}
// /start
const CATEGORY_EMOJIS = {
  apendicitis: "🟡",
  vesicula_biliar: "🟢",
  pancreas: "🟠",
  higado: "🟤",
  colon_diverticulitis: "🔵",
  hernias: "🟣",
  trauma: "🔴",
  uci: "🏥",
  sepsis: "⚫",
  riesgo_preoperatorio: "🫀",
  hemorragia_transfusion: "🩸",
  torax: "🫁",
  endoscopia: "⚪",
  cirugia_pediatrica: "👶",
};
bot.start((ctx) => {
  const categories = getCategories();

  const buttons = categories.map((category) => [
    Markup.button.callback(
      `${CATEGORY_EMOJIS[category] || "📂"} ${category}`,
      `category_${category}`
    ),
  ]);

  ctx.reply(

    "🏥 *SurgScore*\n\n" +

    "Bienvenido al asistente de escalas quirúrgicas.\n\n" +

    "Escribe para buscar una escala.\n\n" +

    "📂 Selecciona una categoría o escribe en el buscador:",

    {

      parse_mode: "Markdown",

      ...Markup.inlineKeyboard(buttons),

    }

  );
});
bot.action(/category_(.+)/, async (ctx) => {
  const category = ctx.match[1];

  const scales = getScales().filter(
    (s) => s.category === category
  );

  const buttons = scales.map((scale) => [
    Markup.button.callback(scale.name, `scale_${scale.id}`),
  ]);

  buttons.push([
    Markup.button.callback("⬅️ Volver", "back_categories"),
  ]);

  await ctx.answerCbQuery();

  ctx.reply(
    `📂 ${category}\n\nSelecciona una escala:`,
    Markup.inlineKeyboard(buttons)
  );
});
bot.action("back_categories", async (ctx) => {
  await ctx.answerCbQuery();

  const categories = getCategories();

  const buttons = categories.map((category) => [
    Markup.button.callback(
      `${CATEGORY_EMOJIS[category] || "📂"} ${category}`,
      `category_${category}`
    )
  ]);

  ctx.reply(
    "🏥 SurgScore\n\nSelecciona una categoría o escribe en el buscador:",
    Markup.inlineKeyboard(buttons)
  );
});

// Al pulsar un botón
bot.action(/scale_(.+)/, async (ctx) => {
  const id = ctx.match[1];

  const scale = getScales().find((s) => s.id === id);

  if (!scale) {
    return ctx.reply("❌ Escala no encontrada.");
  }

  await ctx.answerCbQuery();

  sessions[ctx.from.id] = {
    scaleId: scale.id,
    score: 0,
    currentQuestion: 0,
    waitingNumber: false,
    answers: {},
  };
  await ctx.reply(
    `🏥 *${scale.fullName || scale.name}*\n\n` +
    `📖 ${scale.description}\n\n` +
    `▶️ Comencemos.`,
    {
      parse_mode: "Markdown",
    }
  );
  sendQuestion(ctx, scale, 0);
});
bot.action(/^answer_([^_]+)_(\d+)_(\d+)$/, async (ctx) => {
  const scaleId = ctx.match[1];
  const questionIndex = Number(ctx.match[2]);
  const score = Number(ctx.match[3]);

  const scale = getScales().find((s) => s.id === scaleId);

  if (!scale) return;

  await ctx.answerCbQuery();

  const question = scale.questions[questionIndex];

  const option = question.options.find((o) => o.score === score);

  sessions[ctx.from.id].answers[question.id] = {
    question: question.label || question.text,
    answer: option ? option.label : "",
    score,
  };

  sessions[ctx.from.id].score += score;

  const next = questionIndex + 1;

  if (next >= scale.questions.length) {
    const total = sessions[ctx.from.id].score;

    const interpretation = scale.interpretation.find(
      (item) => total >= item.min && total <= item.max
    );

    let message = `🏥 ${scale.fullName || scale.name}\n\n`;

    message += "📝 Resumen\n\n";

    Object.values(sessions[ctx.from.id].answers).forEach((a) => {
      message += `• ${a.question}: ${a.answer}\n`;
    });

    message += "\n";

    message += `✅ Puntaje total: ${total}\n\n`;

    if (interpretation) {
      message += `📋 Interpretación: ${interpretation.label}\n\n`;
      message += interpretation.description;
    }

    delete sessions[ctx.from.id];

    return ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback("🏠 Menú principal", "home")]
      ])
    );
  }
  
  sendQuestion(ctx, scale, next);
});
bot.action("home", async (ctx) => {
  await ctx.answerCbQuery();

  const categories = getCategories();

  const buttons = categories.map((category) => [
    Markup.button.callback(
      `${CATEGORY_EMOJIS[category] || "📂"} ${category}`,
      `category_${category}`
    ),
  ]);

  return ctx.reply(
    "🏥 *SurgScore*\n\nSelecciona una categoría o escribe en el buscador:",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard(buttons),
    }
  );
});
bot.on("text", (ctx) => {
  const session = sessions[ctx.from.id];

  // Si NO está respondiendo una pregunta numérica,
  // usar el texto como buscador.
  if (!session || !session.waitingNumber) {
    const results = searchScales(ctx.message.text);

    if (results.length === 0) {
      return ctx.reply("🔍 No encontré ninguna escala.");
    }

    const buttons = results.map((scale) => [
      Markup.button.callback(scale.name, `scale_${scale.id}`),
    ]);

    return ctx.reply(
      `🔎 Encontré ${results.length} escala(s):`,
      Markup.inlineKeyboard(buttons)
    );
  }

  const scale = getScales().find((s) => s.id === session.scaleId);

  if (!scale) return;

  const question = scale.questions[session.currentQuestion];

  const value = Number(ctx.message.text);

  if (isNaN(value)) {
    return ctx.reply("❌ Escribe un número válido.");
  }

  const range = question.ranges.find(
    (r) => value >= r.min && value <= r.max
  );

  if (!range) {
    return ctx.reply("❌ Valor fuera del rango permitido.");
  }

  session.answers[question.id] = {
    question: question.label || question.text,
    answer: value,
    score: range.score,
  };
  session.score += range.score;
  session.waitingNumber = false;

  const next = session.currentQuestion + 1;

  if (next >= scale.questions.length) {
    const interpretation = scale.interpretation.find(
      (i) => session.score >= i.min && session.score <= i.max
    );

    let message = `🏥 ${scale.fullName || scale.name}\n\n`;
    message += "📝 Resumen\n\n";

    Object.values(sessions[ctx.from.id].answers).forEach((a) => {
      message += `• ${a.question}: ${a.answer}\n`;
    });

    message += "\n";
    message += `✅ Puntaje total: ${session.score}\n\n`;

    if (interpretation) {
      message += `📋 ${interpretation.label}\n\n`;
      message += interpretation.description;
    }

    delete sessions[ctx.from.id];

    return ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback("🏠 Menú principal", "home")],
      ])
    );
    }
    
    session.currentQuestion = next;
    
    sendQuestion(ctx, scale, next);
    
    });
    
    bot.launch();
    
    console.log("🤖 SurgScore Bot iniciado");