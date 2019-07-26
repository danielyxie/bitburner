import { expect } from "chai";
import {BaseServer} from "../../src/Server/BaseServer";

describe("Base Server file system internal tests", function() {
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


    describe("File operations", function (){
        describe("exists()", function(){
            it("Detect present files/directories as such", function(){
                expect(server.exists("/f1")).to.equal(true);
                expect(server.exists("/dA/f2")).to.equal(true);
                expect(server.exists("/dA/dB/f4")).to.equal(true);
                expect(server.exists("/dA/")).to.equal(true);
                expect(server.exists("/dA")).to.equal(true);
            });
            it("Detect non present files/directories as such", function(){
                expect(server.exists("/f2")).to.equal(false);
                expect(server.exists("/dB")).to.equal(false);
            });
        });
        describe("readFile()", function() {
            it("Can read the content of valid files.", function(){
                expect(()=>server.readFile("/f1")).to.not.throw();
            });
            it("Can read the content of directories", function(){
                expect(()=>server.readFile("/dA")).to.throw();
            });
            it("Can read the content of inexistent paths", function(){
                expect(()=>server.readFile("/f2")).to.throw();
            });
        });
        describe("writeFile()", function() {
            it("Can write in an existing file", function(){
                let old = server.readFile("/f1")
                server.writeFile("/f1", WRITTEN_CONTENT)
                expect(server.readFile("/f1")).to.equal(WRITTEN_CONTENT);
                server.writeFile("/f1", old);

            });
            it("Can write in an inexisting file", function(){
                expect(()=>server.writeFile("/fX", WRITTEN_CONTENT)).to.not.throw();
                server.removeFile("/fX")
            });
            it("Can write in an inexisting file in a new directory if asked to create them on the fly", function(){
                expect(()=>server.writeFile("/d0/fX", WRITTEN_CONTENT, {recursive:true})).to.not.throw();
                server.removeDir("/d0", {recursive:true, force:true});
            });
            it("Can write in an inexisting file in an inexistent directory if asked NOT to create them on the fly", function(){
                expect(()=>server.writeFile("/d0/fX", WRITTEN_CONTENT, {recursive:false})).to.throw();
            });
        });
        describe("copyFile()", function(){
            it("Can copy an existing file in an existing directory if a filename is specified" ,function(){
                server.copyFile("/f1", "/dA/");
                expect(server.readFile("/dA/f1")).to.equal("/f1");
                server.removeFile("/dA/f1", {force:true});
            });
            it("Can copy an existing file in an existing directory if a directory is specified" ,function(){
                expect(()=>server.copyFile("/f1", "/dA")).to.not.throw();
                server.removeFile("/dA/f1", {force:true});
            });
            it("Cannot copy an existing file as itself" ,function(){
                expect(()=>server.copyFile("/f1", "/f1")).to.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                expect(()=>server.copyFile("/f1", "/d0", {recursive:true, targetAsDirectory:true})).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                server.removeDir("/d0", {recursive:true, force:true});
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                expect(()=>server.copyFile("/f1", "/d0/",  {recursive:true})).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                server.removeDir("/d0", {recursive:true, force:true});
            });
        });
        describe("moveFile()", function(){
            it("Can move an existing file into an existing directory if a filename is specified" ,function(){
                expect(()=>server.moveFile("/f1", "/dA/f1")).to.not.throw();
                server.moveFile("/dA/f1", "/f1");
            });
            it("Can move an existing file into an existing directory if a directory is specified" ,function(){
                expect(()=>server.moveFile("/f1", "/dA/")).to.not.throw();
                server.moveFile("/dA/f1", "/f1");
            });
            it("Can rename an existing file" ,function(){
                server.moveFile("/f1", "/fX");
                expect(server.readFile("/fX")).to.equal("/f1");
                server.moveFile("/fX", "/f1");
            });
            it("Can move an existing file into an inexisting directory if asked to create them on the fly" ,function(){
                server.moveFile("/f1", "/d0/", {recursive:true});
                expect(server.readFile("/d0/f1")).to.equal("/f1");
                server.moveFile("/d0/f1", "/f1");
                server.removeDir("/d0", {recursive:true, force:true});
            });
            it("Cannot move an existing file into an inexisting directory if asked NOT to create them on the fly" ,function(){
                expect(()=>server.moveFile("/f1", "/d0/", {recursive:false})).to.throw();
            });
        });
        describe("mkdir()", function(){
            it("Can create a new directory if none exists at the specified name" ,function(){
                expect(()=>server.mkdir("/d0")).to.not.throw();
                server.removeDir("/d0");
            });
            it("Can create a new directory if one already exists at the specified name (no op)" ,function(){
                expect(()=>server.mkdir("/dA")).to.not.throw();
            });
            it("Can create a chain of subdirectories if asked to create them recursively" ,function(){
                expect(()=>server.mkdir("/d0/d0/d0/", {recursive:true})).to.not.throw();
                server.removeDir("/d0", {recursive:true});
            });
            it("Can NOT  create a chain of subdirectories if NOT asked to create them recursively" ,function(){
                expect(()=>server.mkdir("/d0/d0/d0/", {recursive:false})).to.throw();
            });
        });
        describe("mkdir()", function(){
            it("Can create a new directory if none exists at the specified name" ,function(){
                expect(()=>server.mkdir("/d0")).to.not.throw();
                server.removeDir("/d0");
            });
            it("Can create a new directory if one already exists at the specified name (no op)" ,function(){
                expect(()=>server.mkdir("/dA")).to.not.throw();
            });
            it("Can create a chain of subdirectories if asked to create them recursively" ,function(){
                expect(()=>server.mkdir("/d0/d0/d0/", {recursive:true})).to.not.throw();
                server.removeDir("/d0", {recursive:true});
            });
            it("Can NOT  create a chain of subdirectories if NOT asked to create them recursively" ,function(){
                expect(()=>server.mkdir("/d0/d0/d0/", {recursive:false})).to.throw();
            });
        });

    });
})
