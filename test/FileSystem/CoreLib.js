import { expect } from "chai";
import {BaseServer} from "../../src/Server/BaseServer";
import {ls} from "../../src/Server/lib/ls";
import {cp} from "../../src/Server/lib/cp";
import {Terminal} from "../../src/Terminal";
//import {rm} from "../../src/Server/lib/rm";
//import {mkdir} from "../../src/Server/lib/mkdir";
import {mv} from "../../src/Server/lib/mv";
//import {tree} from "../../src/Server/lib/tree";

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
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
                expect(()=>server.removeFile("/dA/f1", {force:true})).to.not.throw();
            });
            it("Can copy an existing file in an existing directory if a directory is specified" ,function(){
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
                expect(()=>server.removeFile("/dA/f1", {force:true})).to.not.throw();
            });
            it("Cannot copy an existing file as itself" ,function(){
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/f1"])).to.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                expect(()=>server.removeDir("/d0", {recursive:true, force:true})).to.not.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                expect(()=>server.removeDir("/d0", {recursive:true, force:true})).to.not.throw();
            });
            it("Can NOT copy multiple files into a single existing file" ,function(){
                expect(()=>cp(server, fakeTerm, out, err, [ "/d0/", "/f1", "-r"])).to.throw();
            });//TODO versioning tests
        });
        describe("mv", function(){
            it("Can move an existing file in an existing directory if a filename is specified" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
                expect(()=>mv(server, fakeTerm, out, err, ["/dA/f1", "/f1", "-T"])).to.not.throw();
            });
            it("Can move an existing file in an existing directory if a directory is specified" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
                expect(()=>mv(server, fakeTerm, out, err, ["/dA/f1", "/f1", "-T"])).to.not.throw();
            });
            it("Cannot move an existing file as itself" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/f1", "-T"])).to.throw();
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                expect(()=>mv(server, fakeTerm, out, err, ["/d0/f1", "/f1", "-r", "-T"])).to.not.throw();
                expect(()=>server.removeDir("/d0", {recursive:true, force:true})).to.not.throw();
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                expect(()=>mv(server, fakeTerm, out, err, ["/d0/f1", "/f1","-r", "-T"])).to.not.throw();
                expect(()=>server.removeDir("/d0", {recursive:true, force:true})).to.not.throw();
            });
            it("Can NOT move multiple files into a single existing file" ,function(){
                expect(()=>mv(server, fakeTerm, out, err, [ "/dA/", "/f1", "-r", "-T"])).to.throw();
            });//TODO versioning tests
        });
        describe("ls()", function(){
            it("Can list the cwd files and subdirectories with a depth of 0" ,function(){
                let expected = ["/dA/","/dA/dB/", "/dA/f2","/dA/f3"].join("\n")
                fakeTerm.currDir = "/dA";
                expect(ls(server, fakeTerm, ["-d", "0"])).to.equal(expected);
            });
            it("Can list the cwd files and subdirectories with a depth of n" ,function(){
                let expected = ["/dA/","/dA/dB/","/dA/dB/f4", "/dA/f2","/dA/f3" ].join("\n")
                fakeTerm.currDir = "/dA";
                expect(ls(server, fakeTerm, ["-d", "5"])).to.equal(expected);
            });
            it("Can list a specified directory with a depth of n" ,function(){
                let expected = ["/dA/","/dA/dB/","/dA/dB/f4" , "/dA/f2","/dA/f3"].join("\n")
                fakeTerm.currDir = "/";
                expect(ls(server, fakeTerm, ["/dA", "-d", "5"])).to.equal(expected);
            });
        });
    });
})
