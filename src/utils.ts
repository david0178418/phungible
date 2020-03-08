export
function range(startValue: number, size: number) {
	return [ ...Array(size - startValue + 1).keys() ].map( i => i +startValue );
}