export function lerp(v1, v2, x) {
	return v1.map((v1v, idx) => { return v2[idx] * x + v1[idx] * (1 - x) });
};

export function createVector(v) {
	return new BABYLON.Vector3(v[0], v[1], v[2]);
}

export function setTransformationNode(node, origin, ydir) {
	node.setAbsolutePosition(origin);
	node.rotation.x = Math.atan2(ydir.z, ydir.y);
	node.rotation.z = -Math.asin(ydir.x / Math.sqrt(ydir.x * ydir.x + ydir.y * ydir.y + ydir.z * ydir.z));
}

export function createPath(keyframes, progress) {
	let path = [];
	let key_id = 1 + Math.floor((keyframes.length - 1) * progress); //1..length
	for (let i = 0; i < key_id; i++) {
		path.push(createVector(keyframes[i]));
	}
	let last_frame_partial = (progress - (key_id - 1) * 1.0 / (keyframes.length - 1)) / ((1.0 / (keyframes.length - 1)));
	if (key_id < keyframes.length) {
		path.push(createVector(lerp(
			keyframes[key_id - 1],
			keyframes[key_id],
			last_frame_partial)));
	}

	return path;
};

export function pathLength(keyframes) {
	let len = 0
	for (let i = 1; i < keyframes.length; i++) {
		len += Math.sqrt(
			Math.pow(keyframes[i][0] - keyframes[i - 1][0], 2) +
			Math.pow(keyframes[i][1] - keyframes[i - 1][1], 2) +
			Math.pow(keyframes[i][2] - keyframes[i - 1][2], 2)
		);
	}

	return len;
}

export function createArrow(scene, material, length) {
	let arrow = new BABYLON.TransformNode("arrow", scene);
	let cylinder = BABYLON.CylinderBuilder.CreateCylinder("cylinder", {
		diameterTop: 0,
		height: length / 3,
		diameterBottom: length / 3,
		tessellation: 96
	}, scene);
	let line = BABYLON.CylinderBuilder.CreateCylinder("cylinder", {
		diameterTop: 0.1 * length,
		height: 0.7 * length,
		diameterBottom: 0.1 * length,
		tessellation: 96
	}, scene);

	// Position arrow pointing in its drag axis
	cylinder.parent = arrow;
	cylinder.material = material;
	cylinder.position.y -= length / 6;

	line.parent = arrow;
	line.material = material;
	line.position.y -= 0.65 * length;

	return arrow;
}