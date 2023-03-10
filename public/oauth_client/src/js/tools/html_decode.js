
	export const htmlDecode = function(input)
	{
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;

	}//end htmlDecode
