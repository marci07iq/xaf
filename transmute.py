import json

def auto_material(data):
	idx = 0
	for elem in data["objects"][0]["elems"]:
		if(elem["filename"].find("ISO") != -1):
			elem["material"] = "screws"


		if(elem["filename"].find("FCCMSSUSHI0018 - Yoke lamination_") != -1):
			idx+=1
			elem["material"] = "lamination_a" if (idx % 2 == 0) else "lamination_b"
		
	return data
	
f = open("manifest_sushi.json", "r")
f2 = open("manifest_sushi2.json", "w")

f2.write(json.dumps(auto_material(json.loads(f.read()))))

