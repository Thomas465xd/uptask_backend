import server from "./server";
import colors from "colors";

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(colors.cyan.bold(`Server listening on port ${port}`));
});