import * as dirHelpers from "../../src/Terminal/DirectoryHelpers";

import { expect } from "chai";

console.log("Beginning Terminal Directory Tests");

describe("Terminal Directory Tests", function() {
    describe("removeLeadingSlash()", function() {
        const removeLeadingSlash = dirHelpers.removeLeadingSlash;

        it("should remove first slash in a string", function() {
            expect(removeLeadingSlash("/")).to.equal("");
            expect(removeLeadingSlash("/foo.txt")).to.equal("foo.txt");
            expect(removeLeadingSlash("/foo/file.txt")).to.equal("foo/file.txt");
        });

        it("should only remove one slash", function() {
            expect(removeLeadingSlash("///")).to.equal("//");
            expect(removeLeadingSlash("//foo")).to.equal("/foo");
        });

        it("should do nothing for a string that doesn't start with a slash", function() {
            expect(removeLeadingSlash("foo.txt")).to.equal("foo.txt");
            expect(removeLeadingSlash("foo/test.txt")).to.equal("foo/test.txt");
        });

        it("should not fail on an empty string", function() {
            expect(removeLeadingSlash.bind(null, "")).to.not.throw();
            expect(removeLeadingSlash("")).to.equal("");
        });
    });

    describe("removeTrailingSlash()", function() {
        const removeTrailingSlash = dirHelpers.removeTrailingSlash;

        it("should remove last slash in a string", function() {
            expect(removeTrailingSlash("/")).to.equal("");
            expect(removeTrailingSlash("foo.txt/")).to.equal("foo.txt");
            expect(removeTrailingSlash("foo/file.txt/")).to.equal("foo/file.txt");
        });

        it("should only remove one slash", function() {
            expect(removeTrailingSlash("///")).to.equal("//");
            expect(removeTrailingSlash("foo//")).to.equal("foo/");
        });

        it("should do nothing for a string that doesn't end with a slash", function() {
            expect(removeTrailingSlash("foo.txt")).to.equal("foo.txt");
            expect(removeTrailingSlash("foo/test.txt")).to.equal("foo/test.txt");
        });

        it("should not fail on an empty string", function() {
            expect(removeTrailingSlash.bind(null, "")).to.not.throw();
            expect(removeTrailingSlash("")).to.equal("");
        });
    });

    describe("isValidFilename()", function() {
        const isValidFilename = dirHelpers.isValidFilename;

        it("should return true for valid filenames", function() {
            expect(isValidFilename("test.txt")).to.equal(true);
            expect(isValidFilename("123.script")).to.equal(true);
            expect(isValidFilename("foo123.b")).to.equal(true);
            expect(isValidFilename("my_script.script")).to.equal(true);
            expect(isValidFilename("my-script.script")).to.equal(true);
            expect(isValidFilename("_foo.lit")).to.equal(true);
            expect(isValidFilename("mult.periods.script")).to.equal(true);
            expect(isValidFilename("mult.per-iods.again.script")).to.equal(true);
            expect(isValidFilename("BruteSSH.exe-50%-INC")).to.equal(true);
            expect(isValidFilename("DeepscanV1.exe-1.01%-INC")).to.equal(true);
            expect(isValidFilename("DeepscanV2.exe-1.00%-INC")).to.equal(true);
            expect(isValidFilename("AutoLink.exe-1.%-INC")).to.equal(true);
        });

        it("should return false for invalid filenames", function() {
            expect(isValidFilename("foo")).to.equal(false);
            expect(isValidFilename("my script.script")).to.equal(false);
            expect(isValidFilename("a^.txt")).to.equal(false);
            expect(isValidFilename("b#.lit")).to.equal(false);
            expect(isValidFilename("lib().js")).to.equal(false);
            expect(isValidFilename("foo.script_")).to.equal(false);
            expect(isValidFilename("foo._script")).to.equal(false);
            expect(isValidFilename("foo.hyphened-ext")).to.equal(false);
            expect(isValidFilename("")).to.equal(false);
            expect(isValidFilename("AutoLink-1.%-INC.exe")).to.equal(false);
            expect(isValidFilename("AutoLink.exe-1.%-INC.exe")).to.equal(false);
            expect(isValidFilename("foo%.exe")).to.equal(false);
            expect(isValidFilename("-1.00%-INC")).to.equal(false);
        });
    });

    describe("isValidDirectoryName()", function() {
        const isValidDirectoryName = dirHelpers.isValidDirectoryName;

        it("should return true for valid directory names", function() {
            expect(isValidDirectoryName("a")).to.equal(true);
            expect(isValidDirectoryName("foo")).to.equal(true);
            expect(isValidDirectoryName("foo-dir")).to.equal(true);
            expect(isValidDirectoryName("foo_dir")).to.equal(true);
            expect(isValidDirectoryName(".a")).to.equal(true);
            expect(isValidDirectoryName("1")).to.equal(true);
            expect(isValidDirectoryName("a1")).to.equal(true);
            expect(isValidDirectoryName(".a1")).to.equal(true);
            expect(isValidDirectoryName("._foo")).to.equal(true);
            expect(isValidDirectoryName("_foo")).to.equal(true);
        });

        it("should return false for invalid directory names", function() {
            expect(isValidDirectoryName("")).to.equal(false);
            expect(isValidDirectoryName("foo.dir")).to.equal(false);
            expect(isValidDirectoryName("1.")).to.equal(false);
            expect(isValidDirectoryName("foo.")).to.equal(false);
            expect(isValidDirectoryName("dir#")).to.equal(false);
            expect(isValidDirectoryName("dir!")).to.equal(false);
            expect(isValidDirectoryName("dir*")).to.equal(false);
            expect(isValidDirectoryName(".")).to.equal(false);
        });
    });

    describe("isValidDirectoryPath()", function() {
        const isValidDirectoryPath = dirHelpers.isValidDirectoryPath;

        it("should return false for empty strings", function() {
            expect(isValidDirectoryPath("")).to.equal(false);
        });

        it("should return true only for the forward slash if the string has length 1", function() {
            expect(isValidDirectoryPath("/")).to.equal(true);
            expect(isValidDirectoryPath(" ")).to.equal(false);
            expect(isValidDirectoryPath(".")).to.equal(false);
            expect(isValidDirectoryPath("a")).to.equal(false);
        });

        it("should return true for valid directory paths", function() {
            expect(isValidDirectoryPath("/a")).to.equal(true);
            expect(isValidDirectoryPath("/dir/a")).to.equal(true);
            expect(isValidDirectoryPath("/dir/foo")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/foo-dir")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/foo_dir")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/.a")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/1")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/a1")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/.a1")).to.equal(true);
            expect(isValidDirectoryPath("/dir_/._foo")).to.equal(true);
            expect(isValidDirectoryPath("/dir-/_foo")).to.equal(true);
        });

        it("should return false if the path does not have a leading slash", function() {
            expect(isValidDirectoryPath("a")).to.equal(false);
            expect(isValidDirectoryPath("dir/a")).to.equal(false);
            expect(isValidDirectoryPath("dir/foo")).to.equal(false);
            expect(isValidDirectoryPath(".dir/foo-dir")).to.equal(false);
            expect(isValidDirectoryPath(".dir/foo_dir")).to.equal(false);
            expect(isValidDirectoryPath(".dir/.a")).to.equal(false);
            expect(isValidDirectoryPath("dir1/1")).to.equal(false);
            expect(isValidDirectoryPath("dir1/a1")).to.equal(false);
            expect(isValidDirectoryPath("dir1/.a1")).to.equal(false);
            expect(isValidDirectoryPath("dir_/._foo")).to.equal(false);
            expect(isValidDirectoryPath("dir-/_foo")).to.equal(false);
        });

        it("should accept dot notation", function() {
            expect(isValidDirectoryPath("/dir/./a")).to.equal(true);
            expect(isValidDirectoryPath("/dir/../foo")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/./foo-dir")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/../foo_dir")).to.equal(true);
            expect(isValidDirectoryPath("/.dir/./.a")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/1/.")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/a1/..")).to.equal(true);
            expect(isValidDirectoryPath("/dir1/.a1/..")).to.equal(true);
            expect(isValidDirectoryPath("/dir_/._foo/.")).to.equal(true);
            expect(isValidDirectoryPath("/./dir-/_foo")).to.equal(true);
            expect(isValidDirectoryPath("/../dir-/_foo")).to.equal(true);
        });
    });

    describe("isValidFilePath()", function() {
        const isValidFilePath = dirHelpers.isValidFilePath;

        it("should return false for strings that are too short", function() {
            expect(isValidFilePath("/a")).to.equal(false);
            expect(isValidFilePath("a.")).to.equal(false);
            expect(isValidFilePath(".a")).to.equal(false);
            expect(isValidFilePath("/.")).to.equal(false);
        });

        it("should return true for arguments that are just filenames", function() {
            expect(isValidFilePath("test.txt")).to.equal(true);
            expect(isValidFilePath("123.script")).to.equal(true);
            expect(isValidFilePath("foo123.b")).to.equal(true);
            expect(isValidFilePath("my_script.script")).to.equal(true);
            expect(isValidFilePath("my-script.script")).to.equal(true);
            expect(isValidFilePath("_foo.lit")).to.equal(true);
            expect(isValidFilePath("mult.periods.script")).to.equal(true);
            expect(isValidFilePath("mult.per-iods.again.script")).to.equal(true);
        });

        it("should return true for valid filepaths", function() {
            expect(isValidFilePath("/foo/test.txt")).to.equal(true);
            expect(isValidFilePath("/../123.script")).to.equal(true);
            expect(isValidFilePath("/./foo123.b")).to.equal(true);
            expect(isValidFilePath("/dir/my_script.script")).to.equal(true);
            expect(isValidFilePath("/dir1/dir2/dir3/my-script.script")).to.equal(true);
            expect(isValidFilePath("/dir1/dir2/././../_foo.lit")).to.equal(true);
            expect(isValidFilePath("/.dir1/./../.dir2/mult.periods.script")).to.equal(true);
            expect(isValidFilePath("/_dir/../dir2/mult.per-iods.again.script")).to.equal(true);
        });

        it("should return false for strings that end with a slash", function() {
            expect(isValidFilePath("/foo/")).to.equal(false);
            expect(isValidFilePath("foo.txt/")).to.equal(false);
            expect(isValidFilePath("/")).to.equal(false);
            expect(isValidFilePath("/_dir/")).to.equal(false);
        });

        it("should return false for invalid arguments", function() {
            expect(isValidFilePath(null)).to.equal(false);
            expect(isValidFilePath()).to.equal(false);
            expect(isValidFilePath(5)).to.equal(false);
            expect(isValidFilePath({})).to.equal(false);
        })
    });

    describe("getFirstParentDirectory()", function() {
        const getFirstParentDirectory = dirHelpers.getFirstParentDirectory;

        it("should return the first parent directory in a filepath", function() {
            expect(getFirstParentDirectory("/dir1/foo.txt")).to.equal("dir1/");
            expect(getFirstParentDirectory("/dir1/dir2/dir3/dir4/foo.txt")).to.equal("dir1/");
            expect(getFirstParentDirectory("/_dir1/dir2/foo.js")).to.equal("_dir1/");
        });

        it("should return '/' if there is no first parent directory", function() {
            expect(getFirstParentDirectory("")).to.equal("/");
            expect(getFirstParentDirectory(" ")).to.equal("/");
            expect(getFirstParentDirectory("/")).to.equal("/");
            expect(getFirstParentDirectory("//")).to.equal("/");
            expect(getFirstParentDirectory("foo.script")).to.equal("/");
            expect(getFirstParentDirectory("/foo.txt")).to.equal("/");
        });
    });

    describe("getAllParentDirectories()", function() {
        const getAllParentDirectories = dirHelpers.getAllParentDirectories;

        it("should return all parent directories in a filepath", function() {
            expect(getAllParentDirectories("/")).to.equal("/");
            expect(getAllParentDirectories("/home/var/foo.txt")).to.equal("/home/var/");
            expect(getAllParentDirectories("/home/var/")).to.equal("/home/var/");
            expect(getAllParentDirectories("/home/var/test/")).to.equal("/home/var/test/");
        });

        it("should return an empty string if there are no parent directories", function() {
            expect(getAllParentDirectories("foo.txt")).to.equal("");
        });
    });

    describe("isInRootDirectory()", function() {
        const isInRootDirectory = dirHelpers.isInRootDirectory;

        it("should return true for filepaths that refer to a file in the root directory", function() {
            expect(isInRootDirectory("a.b")).to.equal(true);
            expect(isInRootDirectory("foo.txt")).to.equal(true);
            expect(isInRootDirectory("/foo.txt")).to.equal(true);
        });

        it("should return false for filepaths that refer to a file that's NOT in the root directory", function() {
            expect(isInRootDirectory("/dir/foo.txt")).to.equal(false);
            expect(isInRootDirectory("dir/foo.txt")).to.equal(false);
            expect(isInRootDirectory("/./foo.js")).to.equal(false);
            expect(isInRootDirectory("../foo.js")).to.equal(false);
            expect(isInRootDirectory("/dir1/dir2/dir3/foo.txt")).to.equal(false);
        });

        it("should return false for invalid inputs (inputs that aren't filepaths)", function() {
            expect(isInRootDirectory(null)).to.equal(false);
            expect(isInRootDirectory(undefined)).to.equal(false);
            expect(isInRootDirectory("")).to.equal(false);
            expect(isInRootDirectory(" ")).to.equal(false);
            expect(isInRootDirectory("a")).to.equal(false);
            expect(isInRootDirectory("/dir")).to.equal(false);
            expect(isInRootDirectory("/dir/")).to.equal(false);
            expect(isInRootDirectory("/dir/foo")).to.equal(false);
        });
    });

    describe("evaluateDirectoryPath()", function() {
        const evaluateDirectoryPath = dirHelpers.evaluateDirectoryPath;

        // TODO
    });

    describe("evaluateFilePath()", function() {
        const evaluateFilePath = dirHelpers.evaluateFilePath;

        // TODO
    })
});
