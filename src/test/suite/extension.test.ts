import * as assert from "assert";

import * as vscode from "vscode";
import * as resolver from "../../resolver";

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	test("isSpec", (done) => {
		let testCases: Array<[string, boolean]> = [
			[
				"/spec/foo/something_spec.rb",
				true,
			],
			[
				"/spec/views/something.html.erb_spec.rb",
				true,
			],
			[
				"/app/foo/something.rb",
				false,
			],
			[
				"/spec/views/something.html.erb.rb",
				false,
			]
		];

		testCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.isSpec(file);
			assert.strictEqual(res, expected);
		});

		done();
	});

	function addSubProject(file: string): string {
		return "/subproject" + file;
	}

	function assertGetRelated(file: string, useRequestSpecs: boolean, expected: Array<string>) {
		let actual = resolver.getRelated(file, useRequestSpecs);

		assert.deepStrictEqual(actual, expected);

		let fileInSub = addSubProject(file);
		let expectedInSub = expected.map(addSubProject);
		let actualInSub = resolver.getRelated(fileInSub, useRequestSpecs);

		assert.deepStrictEqual(actualInSub, expectedInSub);
	}

	test("controller to spec", (done) => {
		assertGetRelated(
			"/app/controllers/users_controller.rb",
			false,
			[
				"/spec/requests/users_controller_spec.rb",
			],
		);

		done();
	});

	test("controller to spec with useRequestSpecs", (done) => {
		assertGetRelated(
			"/app/controllers/users_controller.rb",
			true,
			[
				"/spec/requests/users_request_spec.rb",
			]
		);

		done();
	});

	test("controller nested to spec", (done) => {
		assertGetRelated(
			"/app/controllers/clients/users_controller.rb",
			false,
			[
				"/spec/requests/clients/users_controller_spec.rb",
			]
		);

		done();
	});

	test("controller spec to code", (done) => {
		assertGetRelated(
			"/spec/requests/users_controller_spec.rb",
			false,
			[
				"/app/controllers/users_controller.rb",
			]
		);

		done();
	});

	test("controller nested spec to code with useRequestSpecs", (done) => {
		assertGetRelated(
			"/spec/requests/clients/users_request_spec.rb",
			true,
			[
				"/app/controllers/clients/users_controller.rb",
			]
		);

		done();
	});

	test("controller nested spec to code", (done) => {
		assertGetRelated(
			"/spec/requests/clients/users_controller_spec.rb",
			false,
			[
				"/app/controllers/clients/users_controller.rb",
			]
		);

		done();
	});

	test("request spec to code", (done) => {
		assertGetRelated(
			"/spec/requests/users_controller_spec.rb",
			false,
			[
				"/app/controllers/users_controller.rb",
			]
		);

		done();
	});

	test("model code to spec", (done) => {
		assertGetRelated(
			"/app/models/user.rb",
			false,
			[
				"/spec/models/user_spec.rb",
			]
		);

		done();
	});

	test("model code to spec inside Docker", (done) => {
		assertGetRelated(
			"/usr/src/app/app/models/user.rb",
			false,
			[
				"/usr/src/app/spec/models/user_spec.rb",
			]
		);

		done();
	});

	test("model spec to code", (done) => {
		assertGetRelated(
			"/spec/models/user_spec.rb",
			false,
			[
				"/app/models/user.rb",
			]
		);

		done();
	});

	test("model code spec inside Docker", (done) => {
		assertGetRelated(
			"/usr/src/app/spec/models/user_spec.rb",
			false,
			[
				"/usr/src/app/app/models/user.rb",
			]
		);

		done();
	});

	test("view code to spec", (done) => {
		assertGetRelated(
			"/app/views/namespace/users/_show.html.erb",
			false,
			[
				"/spec/views/namespace/users/_show.html.erb_spec.rb",
			]
		);

		done();
	});

	test("view spec to code", (done) => {
		assertGetRelated(
			"/spec/views/namespace/users/_show.html.erb_spec.rb",
			false,
			[
				"/app/views/namespace/users/_show.html.erb",
			]
		);

		done();
	});

	test("view haml code to spec", (done) => {
		assertGetRelated(
			"/app/views/namespace/users/_show.html.haml",
			false,
			[
				"/spec/views/namespace/users/_show.html.haml_spec.rb",
			]
		);

		done();
	});

	test("view haml spec to code", (done) => {
		assertGetRelated(
			"/spec/views/namespace/users/_show.html.haml_spec.rb",
			false,
			[
				"/app/views/namespace/users/_show.html.haml",
			]
		);

		done();
	});

	test("root lib code to spec", (done) => {
		assertGetRelated(
			"/lib/something/foo.rb",
			false,
			[
				"/spec/lib/something/foo_spec.rb",
			]
		);

		done();
	});

	test("app lib code to spec", (done) => {
		assertGetRelated(
			"/app/lib/something/foo.rb",
			false,
			[
				"/spec/lib/something/foo_spec.rb",
			]
		);

		done();
	});

	test("lib spec to code", (done) => {
		assertGetRelated(
			"/spec/lib/something/foo_spec.rb",
			false,
			[
				"/lib/something/foo.rb",
				"/app/lib/something/foo.rb",
			]
		);

		done();
	});
});
