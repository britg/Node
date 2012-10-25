#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {
	
	if (GUI.Button (Rect (250, 400, 200, 50), "Access Intranet")) {
		Application.LoadLevel(1);
	}
}