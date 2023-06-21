import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";

const PORT = process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true
    });
    app.enableCors();
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

    await app.listen(PORT);
}

bootstrap().then(() => {


    console.log(
        "#################################\n" +
        `Server has started on port ${PORT}\n` +
        "#################################\n"
    );
});
