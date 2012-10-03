#pragma strict

private var tilesInSwipe : Array = new Array();
private var tileCount : int = 0;
private var workingTileType : TileType;
private var lastTile : Tile;
private var swipeLineRenderer : LineRenderer;
private var streamManager : StreamManager;

function Start () {
	var swipeLine : GameObject = GameObject.Find("SwipeLine");
	swipeLineRenderer = swipeLine.GetComponent("LineRenderer");
	streamManager = gameObject.GetComponent("StreamManager");
	ClearSwipe();
}

function Update () {
	DetectInput();
}

function DetectInput () {
	var inputPosition : Vector2;
	var inputV3 : Vector3;
	var position : Vector3;
	var swiping : boolean = false;

	if (Input.touchCount > 0) {
		inputPosition = Input.GetTouch(0).position;
		swiping = true;
	}
	
	if (Input.GetMouseButton(0)) {
		inputPosition = Input.mousePosition;
		swiping = true;
	}
	
	if (swiping) {
		DetectHotspot(inputPosition);
		streamManager.Hold();
	} else {
		streamManager.Release();
        if (tileCount >= 3) {
            CommitSwipe();
        } else if (tileCount > 0) {
        	CancelSwipe();
        }
	}
}

function DetectHotspot (pos : Vector3) {
	Debug.Log("pos is " + pos);
	var p : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(pos.x, pos.y, 10));
	var hit : RaycastHit;
	var tileObject : GameObject;
	
	//if (Physics.Raycast (ray, hit, 10)) {
	Debug.Log("point is " + p);
	if (Physics.Raycast(Vector3(p.x, p.y, -10), Vector3(0, 0, 1), hit, 10)) {
		//Debug.Log("Hit is " + hit);
		tileObject = hit.transform.gameObject; 
		ValidateTileInSwipe(tileObject);
	}
}

function ValidateTileInSwipe (tileObject : GameObject) {
	var tile : Tile = tileObject.GetComponent("Tile");
	Debug.Log("Tile is " + tile);
	
	if (!tile)
		return;
	
	if (tileCount == 0) {
		workingTileType = tile.type;
		Debug.Log("working tile type " + workingTileType);
	}
	
	if (!CloseEnough(tile)) {
		return;
	}
	
	if (tile.claimed) {
		UnclaimTo(tile);
		return;
	}
	
	
	if (tile.type == workingTileType) {
		Debug.Log("Adding Tile to swipe " + tileCount);
		AddTileToSwipe(tile);
	}
}

function UnclaimTo (tile : Tile) {
	for (var i : int = tilesInSwipe.length-1; i >= 0; i--) {
		var unclaim : Tile = tilesInSwipe[i];
		if (!unclaim) {
			continue;
		}
		if (unclaim != tile) {
			RemoveTileAt(i);
		} else {
			break;
		}
	}
}

function CloseEnough (tile : Tile) {

	if (!tile) {
		return false;
	}
	
	if (!lastTile) {
		return true;
	}
	
	var xDist : float = Mathf.Abs(tile.transform.position.x - lastTile.transform.position.x);
	var yDist : float = Mathf.Abs(tile.transform.position.y - lastTile.transform.position.y);
	var xNext : boolean = (xDist <= 2);
	var yNext : boolean = (yDist <= 2);
	
	//Debug.Log("X distance is " + xDist + " " + tile.transform.localScale.x + " " + xNext);
	//Debug.Log("Y distance is " + yDist + " " + tile.transform.localScale.x + " " + yNext);
	
	return (xNext && yNext);
}

function AddTileToSwipe (tile : Tile) {
	tilesInSwipe[tileCount] = tile;
	tile.claimed = true;
	tileCount++;
	lastTile = tile;
	DrawSwipeLine();
	
}

function RemoveTileAt (i : int) {
	var tile : Tile = tilesInSwipe[i];
	
	tile.claimed = false;
	tilesInSwipe.RemoveAt(i);
	tileCount--;
	lastTile = tilesInSwipe[i-1];
	DrawSwipeLine();
}

function ClearSwipe () {
	UnclaimAllTiles();
	tilesInSwipe = new Array();
	tileCount = 0;
	lastTile = null;
	DrawSwipeLine();
}

function CommitSwipe () {
    Debug.Log("Committing swipe!");
    streamManager.Convert(tilesInSwipe);
    ClearSwipe();
}

function CancelSwipe () {
    ClearSwipe();
}

function UnclaimAllTiles () {

	for (var tile : Tile in tilesInSwipe) {
		tile.claimed = false;
	}
}

function DrawSwipeLine () {
	swipeLineRenderer.SetVertexCount(tileCount);
	
	var i : int = 0;
	for (var tile : Tile in tilesInSwipe) {
		var t : Transform = tile.gameObject.transform;
		var x : float = t.position.x;
		var y : float = t.position.y;
		var vert : Vector3 = Vector3(x, y, -0.1);
		swipeLineRenderer.SetPosition(i, vert);
		i++;
	}	
}