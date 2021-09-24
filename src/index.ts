import express from "express"
import routes from "./routes/index"

const app = express()

app.use(routes)

app.get("/", (req, res) => res.send("Hello, World!"))
app.listen(8080, () => console.log("running on 8080"))

