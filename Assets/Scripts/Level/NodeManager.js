#pragma strict

var gridCamera : Camera;
var stream : StreamManager;

private var node : GameObject;
private var downPos : Vector3;
private var upPos : Vector3;
private var moveThreshold : float;

private var gridStart : float = 480.0;

function Start () {
}

function Update () {
	DetectInput();
}

function DetectInput () {
	var inputPosition : Vector2;
	var inputV3 : Vector3;
	var position : Vector3;
	var down : boolean = false;
	var up : boolean = false;

	if (Input.touchCount > 0) {
	
		var touch : Touch = Input.GetTouch(0);
		inputPosition = touch.position;
		
		if (touch.phase == TouchPhase.Began) {
			down = true;
		} else if (touch.phase == TouchPhase.Ended) {
			up = true;
		}
	}
	
	if (Input.GetMouseButtonDown(0)) {
		inputPosition = Input.mousePosition;
		down = true;
	} else if (Input.GetMouseButtonUp(0)) {
		inputPosition = Input.mousePosition;
		up = true;
	}
	
	
	if (down && (inputPosition.y >= gridStart)) {
		inputPosition.y -= gridStart;
		node = CheckDownOnNode(inputPosition);
	}
	
	if (node != null && up) {
		inputPosition.y -= gridStart;
		var otherNode : GameObject = CheckDownOnNode(inputPosition);
		if(node == otherNode) {
			stream.SelectNode(node.GetComponent(Node));
		}
		
		node = null;
	}
	
}


function CheckDownOnNode (screenPos : Vector3) {

	Debug.Log("screen pos is " + screenPos);
	
	var worldPos : Vector3 = gridCamera.ScreenToWorldPoint(Vector3(screenPos.x, screenPos.y, transform.position.z - gridCamera.transform.position.z));
	
	Debug.Log("world pos is " + worldPos);
	
	var hit : RaycastHit;
	
	if (Physics.Raycast(Vector3(worldPos.x, worldPos.y, gridCamera.transform.position.z), Vector3(0, 0, 1), hit, 100)) {
		var hitOn : GameObject = hit.transform.gameObject;
		
		Debug.Log("Hit on " + hitOn + " at " + hit.point);
		if (hitOn.tag == "Node") {
			return hitOn;
		}
	}	

}