var lightMode = false;

window.switchMode = function switchMode()
{
	var body = document.getElementById("body");
	var button = document.getElementById("button_mode");

	if (lightMode)
	{
		body.style.background = "#000000";
		body.style.color = "#FFFFFF";
		
		button.innerHTML = "☀️";
		button.title = "Switch to Light Mode";
		
		lightMode = false;
		return;
	}
	
	body.style.background = "#FFFFFF";
	body.style.color = "#000000";
	
	button.innerHTML = "🌕";
	button.title = "Switch to Dark Mode";

	lightMode = true;
}
