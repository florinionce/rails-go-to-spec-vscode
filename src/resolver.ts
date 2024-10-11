// For any given file return a list of possible matches
export function getRelated(file: string, useRequestSpecs: boolean): string[] {
	if (isSpec(file)) {
		return specToCode(file, useRequestSpecs);
	} else {
		return codeToSpec(file, useRequestSpecs);
	}
}

export function isSpec(file: string): boolean {
	return file.indexOf("_spec.rb") > -1;
}

function codeToSpec(file: string, useRequestSpecs: boolean): string[] {
	const withSpecExt = addSpecExtension(file);
	return switchToSpecDir(withSpecExt, useRequestSpecs);
}

function specToCode(file: string, useRequestSpecs: boolean): string[] {
	const withoutSpecExt = removeSpecExtension(file);
	return switchToCodeDir(withoutSpecExt, useRequestSpecs);
}

function switchToSpecDir(file: string, useRequestSpecs: boolean): string[] {
	let requestSpecFolder = "/spec/controllers/";

	if (useRequestSpecs) {
		requestSpecFolder = "/spec/requests/";
	}

	if (file.includes("/app/controllers/")) {
		let output = file.replace("/app/controllers/", requestSpecFolder);

		if (useRequestSpecs) {
			output = output.replace("_controller", "_request");
		}

		return [output];
	} else if (file.includes("/app/app/")) {
		return [
			file.replace("/app/app/", "/app/spec/"),
		];
	} else if (file.includes("/app/")) {
		return [
			file.replace("/app/", "/spec/"),
		];
	} else if (file.includes("/lib/")) {
		return [
			file.replace("/lib/", "/spec/lib/"),
		];
	} else {
		return [];
	}
}

function switchToCodeDir(file: string, useRequestSpecs: boolean): string[] {
	let requestSpecFolder = "/spec/controllers/";

	if (useRequestSpecs) {
		requestSpecFolder = "/spec/requests/";
	}

	if (file.includes("/spec/config/initializers/")) {
		return [
			file.replace("/spec/", "/"),
		];
	} else if (file.includes("/spec/lib/")) {
		return [
			file.replace("/spec/", "/"),
			file.replace("/spec/", "/app/"),
		];
	} else if (file.includes(requestSpecFolder)) {
		let output = file.replace(requestSpecFolder, "/app/controllers/");

		if (useRequestSpecs) {
			output = output.replace("_request", "_controller");
		}

		return [output];
	} else if (file.includes("/spec/requests/")) {
		return [file.replace("/spec/requests/", "/app/controllers/")];
	} else {
		return [
			file.replace("/spec/", "/app/"),
		];
	}
}

function isViewFile(file: string): boolean {
	const viewRegex = /.erb$|.haml$|.slim$/;
	return viewRegex.test(file);
}

function addSpecExtension(file: string): string {
	if (isViewFile(file)) {
		return file
			.replace(".erb", ".erb_spec.rb")
			.replace(".haml", ".haml_spec.rb")
			.replace(".slim", ".slim_spec.rb");
	} else {
		return file.replace(".rb", "_spec.rb");
	}
}

function removeSpecExtension(file: string): string {
	return file
		.replace(".erb_spec.rb", ".erb")
		.replace(".haml_spec.rb", ".haml")
		.replace(".slim_spec.rb", ".slim")
		.replace("_spec.rb", ".rb");
}
