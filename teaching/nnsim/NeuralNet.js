var NODE_RADIUS         = 40;
var SLIDE_HANDLE_RADIUS = 20;
var SLIDE_LENGTH        = NODE_RADIUS*4;

function is_in_circle(coord, x, y, r) {
    return Math.pow(coord.x - x, 2) + Math.pow(coord.y - y, 2) <= Math.pow(r, 2);
}
function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}
function act(x) {
    return 1/(1 + Math.exp(-x)); //sigmoid function
}
function weight_transform(w) {
    return (32*Math.pow(w,3)+34*w)/3-16*Math.pow(w,2)-3; //found by regressing on points { (0,-3), (0.25,-1), (0.5,0), (0.75,1), (1,3) } such that the weights are between -3 and 3 but with half the sliders being between -1 and 1.
}
function activation_trasform(a) {
    return a;
}

/*********************************************************************/
function Node(x, y, is_input) {
    var $this = this;
    
    $this.x = x;
    $this.y = y;
    $this.is_input = is_input;
}
Node.prototype.draw = function(ctx) {
    var $this = this;
    
    ctx.strokeStyle = "rgb(0,0,0)";
    if ($this.is_input) {
        ctx.fillStyle = "rgb(255,255,255)";
    }
    else {
        ctx.fillStyle = "rgb(0,0,0)";
    }
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc($this.x,$this.y, NODE_RADIUS, 0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
};

/*********************************************************************/
function Edge(src_node, dst_node, init_norm_weight) {
    var $this = this;
    
    $this.src_node = src_node;
    $this.dst_node = dst_node;
    $this.norm_weight = init_norm_weight;
    
    $this.x0 = src_node.x+NODE_RADIUS;
    $this.y0 = src_node.y;
    $this.x1 = dst_node.x-NODE_RADIUS;
    $this.y1 = dst_node.y;
    $this.length = dist($this.x0, $this.y0, $this.x1, $this.y1);
    
    var slider_x0 = $this.x0;
    var slider_y0 = $this.y0;
    var slider_x1 = Math.round($this.x0 + ($this.x1 - $this.x0)*(SLIDE_LENGTH/$this.length));
    var slider_y1 = Math.round($this.y0 + Math.sign($this.y1 - $this.y0)*Math.abs($this.y0 - $this.y1)*(SLIDE_LENGTH/$this.length));
    $this.slider = new Slider($this, slider_x0, slider_y0, slider_x1, slider_y1);
}
Edge.prototype.draw = function(ctx) {
    var $this = this;
    
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo($this.x0, $this.y0);
    ctx.lineTo($this.x1, $this.y1);
    ctx.stroke();
    
    $this.slider.draw(ctx);
};

/*********************************************************************/
function Bias(node, init_norm_weight) {
    var $this = this;
    
    $this.node = node;
    $this.norm_weight = init_norm_weight;
    
    var slider_x0 = node.x - 2*NODE_RADIUS;
    var slider_y0 = node.y + NODE_RADIUS + 3;
    var slider_x1 = node.x + 2*NODE_RADIUS;
    var slider_y1 = node.y + NODE_RADIUS + 3;
    $this.slider = new Slider($this, slider_x0, slider_y0, slider_x1, slider_y1);
}
Bias.prototype.draw = function(ctx) {
    var $this = this;
    
    $this.slider.draw(ctx);
};

/*********************************************************************/
function Slider(owner, x0, y0, x1, y1) {
    var $this = this;
    
    $this.owner = owner;
    $this.x0 = x0;
    $this.y0 = y0;
    $this.x1 = x1;
    $this.y1 = y1;
    $this.x = Math.round(x0 + (x1 - x0)*owner.norm_weight);
    $this.y = Math.round(y0 + Math.sign(y1 - y0)*Math.abs(y0 - y1)*owner.norm_weight);
}
Slider.prototype.is_mouseover = function(coord) {
    var $this = this;
    return is_in_circle(coord, $this.x, $this.y, SLIDE_HANDLE_RADIUS);
};
Slider.prototype.onmousedown = function(coord) {
};
Slider.prototype.ondrag = function(coord) {
    var $this = this;
    
    //Find closest point on slider line to (coord.x, coord.y)
    //
    //Slider:        y =  (y0-y1)/(x0-x1) (x - x0)      + y0
    //Perpendicular: y = -(x0-x1)/(y0-y1) (x - coord.x) + coord.y
    //
    //Intersection x: ((x0-x1)/(y0-y1) coord.x + (y0-y1)/(x0-x1) x0 + coord.y - y0)/((y0-y1)/(x0-x1) + (x0-x1)/(y0-y1))
    //Intersection y: (y0-y1)/(x0-x1) (int_x - x0) + y0
    
    var dx = $this.x0-$this.x1;
    var dy = $this.y0-$this.y1;
    if (dx != 0 && dy != 0) {
        $this.x = (dx/dy*coord.x + dy/dx*$this.x0 + coord.y - $this.y0)/(dy/dx + dx/dy);
        $this.y = dy/dx*($this.x - $this.x0) + $this.y0;
    }
    else if (dy == 0) {
        $this.x = coord.x;
        $this.y = $this.y0;
    }
    else {
        $this.x = $this.x0;
        $this.y = coord.y;
    }
    
    $this.x = Math.min(Math.max($this.x, Math.min($this.x0, $this.x1)), Math.max($this.x0, $this.x1));
    $this.y = Math.min(Math.max($this.y, Math.min($this.y0, $this.y1)), Math.max($this.y0, $this.y1));
    
    if (dx != 0) {
        $this.owner.norm_weight = ($this.x0 - $this.x)/dx;
    }
    else {
        $this.owner.norm_weight = ($this.y0 - $this.y)/dy;
    }
};
Slider.prototype.onmouseup = function(coord) {
};
Slider.prototype.draw = function(ctx) {
    var $this = this;
    
    var shade = Math.round(255*$this.owner.norm_weight);
    ctx.strokeStyle = "rgb("+shade+",0,"+(255-shade)+")";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc($this.x0, $this.y0, 3, 0,2*Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo($this.x0, $this.y0);
    ctx.lineTo($this.x1, $this.y1);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc($this.x, $this.y, SLIDE_HANDLE_RADIUS, 0,2*Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc($this.x1, $this.y1, 3, 0,2*Math.PI);
    ctx.fill();
};

/*********************************************************************/
function NeuralNet(canvas) {
    var $this = this;
    
    $this.canvas = canvas;
    $this.ctx = canvas.getContext('2d');
    $this.nodes = {};
    $this.edges = {};
    $this.biases = {};
    $this.input_nodes = [];
    
    $this.listener = function(){};
    $this.drawables = [];
    $this.interactives = [];
    $this.dragged = null;
    
    canvas.addEventListener('touchstart', function(e){$this._onmousedown(e);}, false);
    canvas.addEventListener('mousedown',  function(e){$this._onmousedown(e);}, false);
	
    canvas.addEventListener('touchmove', function(e){$this._onmousemove(e);}, false);
    canvas.addEventListener('mousemove', function(e){$this._onmousemove(e);}, false);
    
	canvas.addEventListener('touchend', function(e){$this._onmouseup(e);}, false);
    canvas.addEventListener('mouseup',  function(e){$this._onmouseup(e);}, false);
}
NeuralNet.prototype.addNode = function(name, x, y, is_input) {
    var $this = this;
    
    var node = new Node(x, y, is_input);
    $this.nodes[name] = node;
    $this.drawables.push(node);
    if (is_input) {
        $this.input_nodes.push(name);
    }
};
NeuralNet.prototype.addEdge = function(src_name, dst_name, init_norm_weight) {
    var $this = this;
    
    var edge = new Edge($this.nodes[src_name], $this.nodes[dst_name], init_norm_weight);
    if (!(src_name in $this.edges)) {
        $this.edges[src_name] = {};
    }
    $this.edges[src_name][dst_name] = edge;
    $this.interactives.push(edge.slider);
    $this.drawables.push(edge);
};
NeuralNet.prototype.addBias = function(node_name, init_norm_weight) {
    var $this = this;
    
    var bias = new Bias($this.nodes[node_name], init_norm_weight);
    $this.biases[node_name] = bias;
    $this.interactives.push(bias.slider);
    $this.drawables.push(bias);
};
NeuralNet.prototype._mouse_coords = function(e) {
    var $this = this;
    
    var rect = $this.canvas.getBoundingClientRect();
    return {
        'x': (e.targetTouches ? e.targetTouches[0].clientX : e.clientX) - rect.left,
        'y': (e.targetTouches ? e.targetTouches[0].clientY : e.clientY) - rect.top
    };
};
NeuralNet.prototype._onmousedown = function(e) {
    var $this = this;
    
    coord = $this._mouse_coords(e);
    for (var i = 0; i < $this.interactives.length; i++) {
        if ($this.interactives[i].is_mouseover(coord)) {
            $this.dragged = $this.interactives[i];
            $this.dragged.onmousedown(coord);
            $this.draw();
            return;
        }
    }
};
NeuralNet.prototype._onmousemove = function(e) {
    var $this = this;
    
    if ($this.dragged != null) {
        e.stopPropagation();
        e.preventDefault();
        coord = $this._mouse_coords(e);
        $this.dragged.ondrag(coord);
        $this.draw();
    }
};
NeuralNet.prototype._onmouseup = function(e) {
    var $this = this;
    
    if ($this.dragged != null) {
        $this.dragged.onmouseup(coord);
        $this.dragged = null;
        $this.draw();
    }
};
NeuralNet.prototype.evaluate = function(input_values) {
    var $this = this;
    
    var activations = {};
    var next_nodes = [];
    for (var node_name in input_values) {
        activations[node_name] = input_values[node_name];
        next_nodes.push(node_name);
    }
    var weighted_sums = {};
    var incoming_left = {};
    for (var src_name in $this.nodes) {
        if (src_name in $this.edges) {
            for (var dst_name in $this.edges[src_name]) {
                if (!(dst_name in incoming_left)) {
                    incoming_left[dst_name] = {};
                    if (dst_name in $this.biases) {
                        weighted_sums[dst_name] = weight_transform($this.biases[dst_name].norm_weight);
                    }
                    else {
                        weighted_sums[dst_name] = 0.0;
                    }
                }
                incoming_left[dst_name][src_name] = true;
            }
        }
    }
    
    while (next_nodes.length > 0) {
        future_next_nodes = [];
        for (var i = 0; i < next_nodes.length; i++) {
            var src_name = next_nodes[i];
            for (var dst_name in $this.edges[src_name]) {
                if (src_name in incoming_left[dst_name]) {
                    weighted_sums[dst_name] += weight_transform($this.edges[src_name][dst_name].norm_weight)*activations[src_name];
                    delete incoming_left[dst_name][src_name];
                    if (Object.keys(incoming_left[dst_name]).length == 0) {
                        activations[dst_name] = act(weighted_sums[dst_name]);
                        future_next_nodes.push(dst_name);
                        delete incoming_left[dst_name];
                    }
                }
            }
        }
        next_nodes = future_next_nodes;
    }
    
    return activations;
};
NeuralNet.prototype._clear = function() {
    var $this = this;
    
    $this.ctx.save();
    $this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    $this.ctx.clearRect(0, 0, $this.canvas.width, $this.canvas.height);
    $this.ctx.restore();
};
NeuralNet.prototype.draw = function() {
    var $this = this;
    
    $this._clear();
    for (var i = 0; i < $this.drawables.length; i++) {
        $this.drawables[i].draw($this.ctx);
    }
    
    $this.listener();
};