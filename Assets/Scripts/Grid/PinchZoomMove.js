#pragma strict

var minZ : float = -50;
var maxZ : float = -15.2;
var zoomDamper : float = 0.1;
var moveDamper : float = 0.01;
var momentumDamper : float = 10.0;
var momentumMin : float;
var gridCamera : Camera;

private var startDistance : float;
private var lastPos : Vector3 = Vector3.zero;
private var delta : Vector3 = Vector3.zero;

var inputDelay : float = 0.4;
private var didPinch : boolean = false;
private var shouldDelayInput : boolean = false;
private var currentInputDelay : float = 0.0;

function Start () {

}

function Update () {
	var pinch : boolean = PinchZoom(); 
	
	if (!pinch) {
	
		if (shouldDelayInput) {
			currentInputDelay += Time.deltaTime;
			if (currentInputDelay >= inputDelay) {
				shouldDelayInput = false;
				currentInputDelay = 0.0;
			}
		} else {
			Move();
		}
	}
}

function PinchZoom () {

	if (Input.touchCount >= 2) {
	
		var touch0 : Vector2;
		var touch1 : Vector2;
		var distance : float;
		
	    touch0 = Input.GetTouch(0).position;
	    touch1 = Input.GetTouch(1).position;
	
	    distance = Vector2.Distance(touch0, touch1);
	    
	    if (startDistance > 0.0) {
			var perc : float = distance / startDistance;
			var delta : float = startDistance - distance;
		    var z : float = (gridCamera.transform.position.z - (delta * zoomDamper));
			Debug.Log("Delta is " + delta + " damper: " + delta * zoomDamper + " new z is " + z);
		    gridCamera.transform.position.z = Mathf.Clamp(z, minZ, maxZ);
		}
	    
	    startDistance = distance;
	    didPinch = true;
	    return true;
	} else {
		if (didPinch) {
			didPinch = false;
			shouldDelayInput = true;
		}
		startDistance = 0.0;
		return false;
	}
	
}

function Move () {
	var inputPosition : Vector2;
	var inputV3 : Vector3;
	var position : Vector3;
	var moving : boolean = false;
	var worldPos : Vector3;

	if (Input.touchCount == 1) {
		var touch : Touch = Input.GetTouch(0);
		if (touch.phase != TouchPhase.Ended) {
			inputPosition = touch.position;
			moving = true;
		}
	}
	
	if (Input.GetMouseButton(0)) {
		inputPosition = Input.mousePosition;
		moving = true;
	}
	
	if (moving) {
		worldPos = Camera.main.ScreenToWorldPoint(Vector3(inputPosition.x, inputPosition.y, 10));
		if (lastPos != Vector3.zero) {
			TestMove(worldPos);
		}
		lastPos = worldPos;
	} else {
		Momentum();
		lastPos = Vector3.zero;
	}

}

function TestMove (p : Vector3) {

	var hit : RaycastHit;
	
	//if (Physics.Raycast (ray, hit, 10)) {
	if (Physics.Raycast(Vector3(p.x, p.y, -10), Vector3(0, 0, 1), hit, 20)) {
		var hitOn : GameObject = hit.transform.gameObject;
		if (hitOn.tag == "GridTexture") {
			delta = p - lastPos;
			var newPos : Vector3 = gridCamera.transform.position - (delta * moveDamper);
			gridCamera.transform.position = newPos;
		}
	}	
	
}

function Momentum () {
	if (delta.magnitude <= momentumMin) return;
	
	var newPos : Vector3 = gridCamera.transform.position - (delta * moveDamper);
	gridCamera.transform.position = newPos;
	
	delta -= delta * Time.deltaTime * momentumDamper;
}

function CheckX () {
}

function CheckY () {

}