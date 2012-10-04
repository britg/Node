#pragma strict

var nodes : GameObject[];
var pathLine : GameObject;
private var pathLineRenderer : LineRenderer;

function Start () {
	pathLineRenderer = pathLine.GetComponent("LineRenderer");
}

function Update () {
	ConnectNodes();
}

function ConnectNodes () {

	var node : GameObject;

	pathLineRenderer.SetVertexCount(nodes.Length);
	
	for (var i : int = 0; i < nodes.Length; i++) {
		node = nodes[i];
		pathLineRenderer.SetPosition(i, node.transform.position);
	}

}