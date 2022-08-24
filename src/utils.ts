interface Vector2{
    x:number,
    y:number,
}

class Utils{
    static toRadians (angle:number):number {
        return angle * (Math.PI / 180);
    }
    
    static toDegrees (angle:number):number {
        return angle * (180 / Math.PI);
    }
    
    static subtractVector2(a:Vector2, b:Vector2):Vector2{
        return {x:a.x - b.x, y:a.y - b.y} as Vector2;
    }
    static pointDist(p1:Vector2, p2:Vector2):number{
        return Math.sqrt(Math.pow(p2.x-p1.x, 2)+Math.pow(p2.y-p1.y, 2))
    }
    static pointAngle(p1:Vector2, p2:Vector2){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x)
    }
}

export {Utils};