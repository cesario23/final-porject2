const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/user/userRouter");
const errorController = require ("./routes/utils/errorController")
const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");

const app = express();


app.use(cors());
if(process.env.NODE_ENV === "development"){
 app.use(logger("dev"));
}
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);

app.all("*", function(req,res, next){
    next(
        new ErrorMessageHandlerClass(
            `Cannot find ${req.originalUrl} on this server! Check your URL`,
            404
        )
    )
});

app.use(errorController);


module.exports = app;
