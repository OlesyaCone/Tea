let express = require("express");
let app = express();
let cors = require("cors");
app.use(cors());
let port = 3005;
app.use(express.json());
let { Server } = require("socket.io");
let io = new Server(3000, {
  cors: {},
});
app.listen(port, function () {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
let mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tea");
app.use(express.static("public"));

let schema = new mongoose.Schema({
  title: { type: String, required: true },
  minDescription: { type: String, required: true },
  teaType: { type: String, required: true },
  teaImage: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 1, max: 1000 },
  deliveryTime: { type: Number, required: true, min: 1 },
  cart: { type: Boolean, default: false },
  unedited: { type: Boolean, default: false },
});
let Tea = mongoose.model("tea", schema);

let schemas = new mongoose.Schema({
  name: String,
  definition: String,
  kinds: String,
  welding: String,
  img: String,
});
let Info = mongoose.model("info", schemas);

app.get("/teas", async function (req, res) {
  let data = await Tea.find();
  res.send(data);
});

app.post("/create", async function (req, res) {
  let {
    title,
    minDescription,
    teaType,
    teaImage,
    description,
    price,
    deliveryTime,
  } = req.body;

  if (
    !title ||
    !minDescription ||
    !teaType ||
    !price ||
    !description ||
    !deliveryTime
  ) {
    res.sendStatus(400);
    return;
  }

  let double = await Tea.exists({ title: title });
  if (double) {
    res.sendStatus(400);
    return;
  }

  if (!teaImage) {
    teaImage =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ScX6Y6_Q2hikXb3RXw4B3D43nd63zSay2A&s";
  }

  let tea = new Tea({
    title,
    minDescription,
    teaType,
    teaImage,
    description,
    price,
    deliveryTime,
  });

  await tea.save();
  res.status(201).send(tea);
  console.log(tea);
});

let cart = [];
app.get("/loadCart", async function (req, res) {
  let data = await Tea.find({ cart: true });
  res.send(data);
});

app.put("/addTeaToCart", async function (req, res) {
  const id = req.body.id;
  const tea = await Tea.findOne({ _id: id });

  if (!tea) {
    return res.sendStatus(404);
  }

  const existingItem = await Tea.findOne({ _id: id, cart: true });
  if (existingItem) {
    return res.status(400).send({ message: "Товар уже добавлен в корзину" });
  }

  tea.cart = true;
  await tea.save();

  res.status(200).send(tea);
});
app.put("/purchase", async function (req, res) {
  try {
    const teas = await Tea.find({ cart: true });
    teas.forEach(async (tea) => {
      tea.cart = false;
      await tea.save();
    });

    res.status(200).send("Все товары помечены как купленные");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ошибка сервера при покупке" });
  }
});

app.put("/deleteTeaFromCart", async function (req, res) {
  try {
    const id = req.body.id;
    const tea = await Tea.findOne({ _id: id });
    if (!tea) {
      return res.status(404).send({ error: "Чай не найден" });
    }
    tea.cart = false; 
    await tea.save();
    res.status(200).send(tea); 
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ошибка сервера" });
  }
});

app.put("/tea/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const tea = await Tea.findOneAndUpdate(
      { _id: id },
      {
        title: req.body.title,
        minDescription: req.body.minDescription,
        teaImage: req.body.teaImage,
        teaType: req.body.teaType,
        description: req.body.description,
        price: Number(req.body.price),
        deliveryTime: Number(req.body.deliveryTime),
      },
      { new: true }
    );

    res.status(200).send(tea);
  } catch (error) {
    res.status(500).send("Ошибка на сервере");
  }
});

app.delete("/tea/:id", async function (req, res) {
  try {
    const id = req.params.id;
    await Tea.deleteOne({ _id: id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: "Ошибка при удалении чая", error });
  }
});

app.get("/edit", async function (req, res) {
  let data = await Tea.find({ unedited: false });
  res.send(data);
});
app.get("/info", async function (req, res) {
  let data = await Info.find();
  res.send(data);
});
