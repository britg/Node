#pragma strict

private var streamManager : StreamManager;

private var y : float = 400;
private var side : float = 70.0;
private var margin : float = 20.0;
private var rates : Array = new Array(1, 2, 3, 4, 5);

function Start () {
	streamManager = gameObject.GetComponent("StreamManager");
}

function Update () {

}

function OnGUI () {

	var rate : int;
	
	for (rate in rates) {
		var x : float = (side*(rate-1) + rate*margin);
		if (GUI.Button (Rect (x, y,side,side), rate + "X")) {
			streamManager.fallRate = rate;
		}
	
	}


	x += side + (rate)*margin;
	if (GUI.Button (Rect (x, y,side,side), "Reset")) {
		Application.LoadLevel(0);
	}
	

}