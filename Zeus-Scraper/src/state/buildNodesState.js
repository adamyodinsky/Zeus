const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const config = require("../config/config");


const test = async() => {
    let command = `kubectl describe nodes`;
    let nodeString;

    try {
        nodeString = await exec(command);
        let nodesArray = nodeString.stdout.split(/\n\s*\n/);
        console.log(nodesArray);
    } catch (err) {
        logger.error(err.stack);
    }

    // const text = "1asdasdasd\n" +
 //     "asdasdasdasd\n" +
 //     "asdasdasd\n" +
 //     "asasdasd\n" +
 //     "\n" +
 //     "2asasdasdasd\n" +
 //     "\n" +
 //     "\n" +
 //     "3asasdasdasdfkakasdkasd\n" +
 //     "asdasdasd\n";
 //
 //    console.log(text);


    // const textArray = text.split(/\n\s*\n/);
    // console.log(textArray);
    // console.log(textArray[0]);
};


test().catch((e) =>{
    console.log(e.stack);
    process.exit(1);
});