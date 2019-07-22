import {TerminalListener} from "./TerminalListener.js";
// CUSTOM LISTENER READING AND BUILDING COMMANDS FROM THE AST.
export class CommandListener extends TerminalListener{

	constructor(){
		super();
		this.parsedCommands = [];
		this.currentCommand = {};
	}

	enterCommand(ctx){
		this.currentCommand = { name:ctx.name.getText(), args:[], kwargs:{}, orderedArgs:[] };
	}

    enterArg(ctx){
        this.currentCommand.args.push(ctx.getChild(0).getText());
        this.currentCommand.orderedArgs.push(ctx.getChild(0).getText());
    }

    enterKeyvalue(ctx){
        let key = ctx.k.getText();
        let value = ctx.v.getText();
        this.currentCommand.kwargs[key] = value;
        this.currentCommand.orderedArgs.push( `${key}=${value}`);
    }

	exitCommand(ctx){
        this.currentCommand.string = `${this.currentCommand.name} ${this.currentCommand.orderedArgs.join(" ")}`;
        this.parsedCommands.push(this.currentCommand);
        //console.log(`Parsed command ${this.currentCommand.name}: args=${JSON.stringify(this.currentCommand.args)}, namedArgs=${JSON.stringify(this.currentCommand.kwargs)}`);
	}
}