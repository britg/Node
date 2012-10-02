#pragma strict

var minZ : float = 1.0;
var maxZ : float = 50.0;
var zoomDamper : float = 0.1;
var moveDamper : float = 0.01;

private var startDistance : float;

function Start () {

}

function Update () {

	PinchZoom();
	Move();

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
			var perc = distance / startDistance;
		    var z : float = (transform.position.z + ((maxZ - minZ) * (1.0 - perc) * zoomDamper));
		    transform.position.z = Mathf.Clamp(z, minZ, maxZ);
		}
	    
	    startDistance = distance;
	} else {
		startDistance = 0.0;
	}
	
}

function Move () {

	if (Input.touchCount == 1) {
		var delta : Vector2 = Input.GetTouch(0).deltaPosition * moveDamper;
		var newPos : Vector3 = transform.position + delta;
		
		
	} else if (Input.touchCount == 0) {
		
	}

}

function CheckX () {
}

function CheckY () {

}