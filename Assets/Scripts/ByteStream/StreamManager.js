#pragma strict

var bytes : GameObject[];

var cols : float = 7.0;
var startY : float = 6.51;
var fallRate : float = 1.0;
private var fallInterval : float;
private var currentFallTime : float = 0.0;

private var width : float;
private var byteWidth : float;
private var byteZ : float = -0.001;

private var started : boolean = false;
private var shouldFall : boolean = false;
private var shouldBlink : boolean = true;
private var blinkTime : float = 0.4;
private var currentBlinkTime : float = 0.0;

var initializingText : GUIText;
var selectText : GUIText;
var initializeDelay : float = 3.0;

private var selectedNode : Node;
var idCard : GameObject;

var swipeManager : SwipeManager;

function Start () {
	width = transform.renderer.bounds.size.x;
	byteWidth = width / cols;
}

function Update () {

	if (started && shouldFall) {
		CalcFallInterval();
		Fall();
		
		currentFallTime += Time.deltaTime;
		if (currentFallTime >= fallInterval) {
			AddRow();
			RemoveRows();
			currentFallTime = 0.0;
		}
	}
	
	if (shouldBlink) {
	
		currentBlinkTime += Time.deltaTime;
		if (currentBlinkTime > blinkTime) {
			ToggleInitializingText();
			currentBlinkTime = 0.0;
		}
	
	} else {
		initializingText.enabled = false;
	}
	
}

function ToggleInitializingText () {
	initializingText.enabled = !initializingText.enabled;
}

function CalcFallInterval () {
	fallInterval = byteWidth / fallRate;
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

function AddRow () {

	var ray : Ray;
	var x : float = byteWidth/2;
	var y : float = startY - byteWidth/2;
	
	DrawRow(startY);

}

function RemoveRows () {
	var inPlay : Array = GameObject.FindGameObjectsWithTag("Byte");
	
	for (var b : GameObject in inPlay) {
		if (b.transform.position.y < -1) {
			GameObject.Destroy(b);
		}
	}
}

function ClearStream () {
	var inPlay : Array = GameObject.FindGameObjectsWithTag("Byte");
	
	for (var b : GameObject in inPlay) {
		GameObject.Destroy(b);
	}
}

function Convert (tiles : Array) {
	Debug.Log("Convert " + tiles);
	
	for (var tile : Tile in tiles) {
		GameObject.Destroy(tile.gameObject);
	}
}

function SelectNode (node : Node) {
	Stop();
	selectedNode = node;
	selectText.active = false;
	idCard.SetActive(true);
}

function Begin () {
	started = true;
	InitializeStream();
}

function Stop () {
	started = false;
	shouldFall = false;
	swipeManager.enabled = false;
	ClearStream();
}

function Pause () {
	shouldFall = false;
}

function Resume() {
	if (started) {
		shouldFall = true;
		swipeManager.enabled = true;
	}
}

function InitializeStream () {
	idCard.SetActive(false);
	shouldBlink = true;
	initializingText.active = true;
	yield WaitForSeconds(initializeDelay);
	shouldBlink = false;
	initializingText.active = false;
	Resume();
}
