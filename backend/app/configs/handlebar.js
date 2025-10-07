import path from "path";
import hbs from "handlebars";
import { config } from "../configs/index.js";

hbs.registerHelper("app", () => config.app);

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.join(process.cwd(), "app/templates/emails"),
    layoutsDir: path.join(process.cwd(), "app/templates/emails"),
    defaultLayout: false,
  },
  viewPath: path.join(process.cwd(), "app/templates/emails"),
  extName: ".hbs",
};

export default handlebarOptions;
