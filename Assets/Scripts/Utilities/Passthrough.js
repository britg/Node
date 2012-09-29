#pragma strict 
 
var layerMask : LayerMask; //make sure we aren't in this layer 
var skinWidth : float = 0.1; //probably doesn't need to be changed 
private var minimumExtent : float; 
private var partialExtent : float; 
private var sqrMinimumExtent : float; 
private var previousPosition : Vector3; 
private var myRigidbody : Rigidbody; 
//initialize values 
function Awake() { 
   myRigidbody = rigidbody; 
   previousPosition = myRigidbody.position; 
   minimumExtent = Mathf.Min(Mathf.Min(collider.bounds.extents.x, collider.bounds.extents.y), collider.bounds.extents.z); 
   partialExtent = minimumExtent*(1.0 - skinWidth); 
   sqrMinimumExtent = minimumExtent*minimumExtent; 
   
} 

function TestHit() {
   var hitInfo : RaycastHit; 
   var test : boolean = Physics.Raycast(transform.position, -Vector3.up, hitInfo, Mathf.Infinity, layerMask.value);
   Debug.Log(" Hit ? " +test + " Hitinfo " + hitInfo);
}
 
function FixedUpdate() { 
	//TestHit();
   //have we moved more than our minimum extent? 
   var movementThisStep : Vector3 = myRigidbody.position - previousPosition; 
   var movementSqrMagnitude : float = movementThisStep.sqrMagnitude;
   if (movementSqrMagnitude > sqrMinimumExtent) { 
      var movementMagnitude : float = Mathf.Sqrt(movementSqrMagnitude);
      var hitInfo : RaycastHit; 
      //check for obstructions we might have missed 
      //Debug.Log("Previous position: " + previousPosition + " movement this step " + movementThisStep + " magnitude " + movementMagnitude);
      var test : boolean = Physics.Raycast(previousPosition, movementThisStep, hitInfo, movementMagnitude);
      //Debug.Log(" Hit ? " +test);
      if (test)  {
      	//Debug.Log("Passthrough detected!");
         //myRigidbody.position = hitInfo.point - (movementThisStep/movementMagnitude)*partialExtent; 
         myRigidbody.position = hitInfo.point;
         myRigidbody.velocity = Vector3.zero;
      }
   } 
   previousPosition = myRigidbody.position; 
}