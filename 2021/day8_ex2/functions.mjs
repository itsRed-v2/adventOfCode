// Renvoie un array qui ne contient que les valeurs qui sont en commun avec les deux arrays donnés
function onlyKeepMatching(array1, array2) {
	const newArray = [];

	for (const element of array1) {
		if (array2.includes(element)) {
			newArray.push(element);
		}
	}

	return newArray;
}

// Renvoie true si le biggerArray contient toutes les valeurs que contient smallerArray
// Permet de déterminer si un segment est forcément allumé pour un certain pattern
// 		ex: si on a les possibilités suivantes pour le segment D:
// 			['b', 'c', 'e', 'g']
// 		et qu'on a le pattern "cbdgef"
// 		alors le segment D est forcément allumé car toutes ses possibilités sont contenues dans le pattern
function isArrayContained(smallerArray, biggerArray) {
	for (const element of smallerArray) {
		if (!biggerArray.includes(element)) return false;
	}
	return true;
}

function removeArrayElement(array, value) {
	let index = array.indexOf(value);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

function equalArray(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (let value of array1) if (!array2.includes(value)) return false;
    return true;
}

export {
	onlyKeepMatching,
	isArrayContained,
	removeArrayElement,
	equalArray,
}