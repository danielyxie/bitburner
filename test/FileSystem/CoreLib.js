import { expect } from "chai";
import {BaseServer} from "../../src/Server/BaseServer";
import {ls} from "../../src/Server/lib/ls";
import {cp} from "../../src/Server/lib/cp";
import {cat} from "../../src/Server/lib/cat";
import {Terminal} from "../../src/Terminal";
import {rm} from "../../src/Server/lib/rm";
import {mkdir} from "../../src/Server/lib/mkdir";
import {mv} from "../../src/Server/lib/mv";
import {tree} from "../../src/Server/lib/tree";

describe("BaseServer file system core library tests", function() {
    /**
     * In the following tests, every directory will be prefixed by a 'd', and every file by a 'f'.
     * existing files and directories will be suffixed with a number (f1,f2...) and a letter (dA, dB,...) respectively.
     * non existent ones will see this suffix inverted, files will be suffixed with letters (fX, fZ...) and directories with numbers (d0, d1, d2...);
     */
    const testingVolJSON = {
        "/f1":"/f1",
        "/dA/f2":"/dA/f2",
        "/dA/f3":"/dA/f3",
        "/dA/dB/f4":"/dA/dB/f4",
    };
    const WRITTEN_CONTENT = "written content";
    const server = new BaseServer();
    server.restoreFileSystem(testingVolJSON);
    let out = (msg) => {}; // null stream
    let err = (msg) => {throw msg}; // exception callback
    let fakeTerm = Terminal;
    fakeTerm.currDir = "/";
    fakeTerm.out = out;
    fakeTerm.err = err;
    fakeTerm.post =out;
    fakeTerm.postError = err;


    describe("File operations", function (){
        describe("cp", function(){

            it("Can copy an existing file in an existing directory if a filename is specified" ,function(){
                server.restoreFileSystem(testingVolJSON);
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Can copy an existing file in an existing directory if a directory is specified" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Cannot copy an existing file as itself" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/f1"])).to.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can NOT copy multiple files into a single existing file" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, [ "/d0/", "/f1", "-r"])).to.throw();
            });//TODO versioning tests
        });
        describe("mv", function(){
            it("Can move an existing file in an existing directory if a filename is specified" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Can move an existing file in an existing directory if a directory is specified" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Cannot move an existing file as itself" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/f1", "-T"])).to.throw();
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can NOT move multiple files into a single existing file" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mv(server, fakeTerm, out, err, [ "/dA/", "/f1", "-r", "-T"])).to.throw();
            });//TODO versioning tests
        });
        describe("ls", function(){
            it("Can list the cwd files and subdirectories with a depth of 0" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = ["/dA/","/dA/dB/", "/dA/f2","/dA/f3"].join("\n")
                fakeTerm.currDir = "/dA";
                expect(ls(server, fakeTerm, out, err, ["-d", "0"])).to.equal(expected);
            });
            it("Can list the cwd files and subdirectories with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = ["/dA/","/dA/dB/","/dA/dB/f4", "/dA/f2","/dA/f3" ].join("\n")
                fakeTerm.currDir = "/dA";
                expect(ls(server, fakeTerm, out, err,["-d", "5"])).to.equal(expected);
            });
            it("Can list a specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = ["/dA/","/dA/dB/","/dA/dB/f4" , "/dA/f2","/dA/f3"].join("\n")
                fakeTerm.currDir = "/";
                expect(ls(server, fakeTerm, out, err, ["/dA", "-d", "5"])).to.equal(expected);
            });
            it("Can list multiple distant specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = ["/","/dA/", "/dev/","/f1","/~trash/", "/dA/dB/","/dA/dB/f4"].join("\n")
                fakeTerm.currDir = "/";
                expect(ls(server, fakeTerm, out, err, ["/","/dA/dB/", "-d", "0"])).to.equal(expected);
            });
            it("Can list multiple combined specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = ["/","/dA/", "/dev/","/f1","/~trash/", "/dA/","/dA/dB/","/dA/f2", "/dA/f3", ].join("\n")
                fakeTerm.currDir = "/";
                expect(ls(server, fakeTerm, out, err, ["/","/dA/", "-d", "0"])).to.equal(expected);
            });
        });

        describe("tree", function(){
            it("Can list the cwd files and subdirectories with a depth of 0" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "├──f2",
                    "└──f3"
                    ].join("\n")
                fakeTerm.currDir = "/dA";
                expect(tree(server, fakeTerm, out, err, ["-d", "0"])).to.equal(expected);
            });
            it("Can list the cwd files and subdirectories with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "│  └──f4",
                    "├──f2",
                    "└──f3"
                    ].join("\n")
                fakeTerm.currDir = "/dA";
                expect(tree(server, fakeTerm, out, err,["-d", "5"])).to.equal(expected);
            });
            it("Can list a specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "│  └──f4" ,
                    "├──f2",
                    "└──f3"
                    ].join("\n")
                fakeTerm.currDir = "/";
                expect(tree(server, fakeTerm, out, err, ["/dA", "-d", "5"])).to.equal(expected);
            });
            it("Can list multiple distant specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = [
                    "/",
                    "├──dA/",
                    "├──dev/",
                    "├──f1",
                    "└──~trash/",
                    "/dA/dB/",
                    "└──f4"
                    ].join("\n")
                fakeTerm.currDir = "/";
                expect(tree(server, fakeTerm, out, err, ["/","/dA/dB/", "-d", "0"])).to.equal(expected);
            });
            it("Can list multiple combined specified directory with a depth of n" ,function(){
                server.restoreFileSystem(testingVolJSON);

                let expected = [
                    "/",
                    "├──dA/",
                    "├──dev/",
                    "├──f1",
                    "└──~trash/",
                    "/dA/",
                    "├──dB/",
                    "├──f2",
                    "└──f3",
                    ].join("\n")
                fakeTerm.currDir = "/";
                expect(tree(server, fakeTerm,out, err, ["/","/dA/", "-d", "0"])).to.equal(expected);
            });
        });

        describe("mkdir", function(){
            it("Can create a new directory if none exists at the specified name" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mkdir(server, fakeTerm, out, err,["/d0"])).to.not.throw();
            });
            it("Cannot create a new directory if one already exists at the specified name" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mkdir(server, fakeTerm, out, err,["/dA"])).to.throw();
            });
            it("Can create a chain of subdirectories if asked to create them recursively" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mkdir(server, fakeTerm, out, err,["/d0/d0/d0/", "-r"])).to.not.throw();
            });
            it("Can NOT  create a chain of subdirectories if NOT asked to create them recursively" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mkdir(server, fakeTerm, out, err, ["/d0/d0/d0/"])).to.throw();
            });
        });
        describe("rm", function(){
            it("Can remove an existing file" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(server.exists("/f1")).to.equal(true);
                expect(()=>rm(server, fakeTerm, out, err, ["/f1"])).to.not.throw();
                expect(server.exists("/f1")).to.equal(false);
            });
            it("Can remove an empty directory" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>mkdir(server, fakeTerm, out, err, ["/d0"])).to.not.throw();
                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.not.throw();
                expect(server.exists("/d0")).to.equal(false);
            });
            it("Can NOT remove an unexisting directory" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.throw();
            });
            it("Can remove a directory having files only with the recursive flag" ,function(){
                server.restoreFileSystem(testingVolJSON);

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0/f1", "-T", "-r"])).to.not.throw();
                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.throw();
                expect(server.exists("/d0")).to.equal(true);
                expect(()=>rm(server, fakeTerm, (msg)=>{console.log(msg)}, err, ["/d0", "-r"])).to.not.throw();
                expect(server.exists("/d0")).to.equal(false);
            });
        });
        describe("cat", function(){
            it("Can print an existing file" ,function(){
                server.restoreFileSystem(testingVolJSON);
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/f1"])).to.not.throw();
                expect(result).to.equal(server.readFile("/f1"))
            });
            it("Can print multiple files of a single directory excluding its subdirectories" ,function(){
                server.restoreFileSystem(testingVolJSON);
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/dA"])).to.not.throw();
                expect(result).to.equal(server.readFile("/dA/f3")+server.readFile("/dA/f2"));
            });
            it("Can print multiple files of a single directory including its subdirectories if using the recursive flag" ,function(){
                server.restoreFileSystem(testingVolJSON);
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/dA", "-r"])).to.not.throw();
                expect(result).to.equal([server.readFile("/dA/f3"),server.readFile("/dA/f2"),server.readFile("/dA/dB/f4")].join(""));
            });
        });
    });
})
