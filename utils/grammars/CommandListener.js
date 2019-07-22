
// CUSTOM LISTENER READING AND BUILDING COMMANDS FROM THE AST.
class CommandListener extends TerminalListener{

	constructor(){
		super();
		this.commands = [];
		this.currentCommand = [];
	}

	enterCommand(ctx){
		this.currentCommand = [];
	}

	exitCommand(ctx){
		this.commands.push(this.currentCommand);
		this.currentCommand = [];
	}
}

exports.CommandListener = CommandListener;