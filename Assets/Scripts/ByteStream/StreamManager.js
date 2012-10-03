#pragma strict

var bytes : GameObject[];

var cols : float = 7.0;
var startY : float = 6.51;
var fallRate : float = 1.0;

private var width : float;
private var byteWidth : float;
private var byteZ : float = -0.001;

var checkTime : float = 0.1;
private var currentCheckTime : float = 0.0;

function Start () {
	width = transform.renderer.bounds.size.x;
	byteWidth = width / cols;
	
}

function Update () {
	Fall();
	
	currentCheckTime += Time.deltaTime;
	if (currentCheckTime >= checkTime) {
		FillNewRow();
		RemoveRows();
		currentCheckTime = 0.0;
	}
	
}

function DrawRow (y : float) {
	var prefab : GameObject;
	var pos : Vector3;
	
	for (var i : int; i < cols; i++) {
		prefab = ChooseByte();
		pos = Vector3(i*byteWidth + byteWidth/2, y, byteZ);
		var b : GameObject = Instantiate(prefab, pos, Quaternion.identity);
		b.transform.parent = transform;
	}
}

function ChooseByte () {
	var i : int = Random.Range(0, bytes.Length);
	return bytes[i];
}

function Fall () {
	var inPlay : Array = GameObject.FindGameObjectsWithTag("Byte");
	
	for (var b : GameObject in inPlay) {
		b.transform.position.y -= fallRate * Time.deltaTime;
	}
}

function FillNewRow () {

	var ray : Ray;
	var x : float = byteWidth/2;
	var y : float = startY - byteWidth/2;
	
	if (!Physics.Raycast(Vector3(x, y, -10), Vector3(0, 0, 1), 10)) {
		Debug.Log("Drawing new row");
		DrawRow(startY);
	}

}

function RemoveRows () {
	var inPlay : Array = GameObject.FindGameObjectsWithTag("Byte");
	
	for (var b : GameObject in inPlay) {
		if (b.transform.position.y < -1) {
			GameObject.Destroy(b);
		}
	}
}