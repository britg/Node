#pragma strict

var stream : StreamManager;

function Start () {

}

function Update () {

}

function OnGUI () {
	
	if (GUI.Button (Rect (200, 760, 200, 50), "Initialize Hacking")) {
		stream.Begin();
	}
}