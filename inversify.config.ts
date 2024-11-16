import { Container } from "inversify";
import { UserController } from "./src/controllers/user.controller";
import { UserService } from "./src/services/user.service";

const container = new Container();
container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(UserService).toSelf();

export default container;