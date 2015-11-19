
/* Array */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.sortNormal = function(){
	this.sort(function(a,b) {
		return a-b;
	});
}