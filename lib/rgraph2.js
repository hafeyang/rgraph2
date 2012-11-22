/**
* 	RGraph Version 2
*	graph implementation by Raphael
*	@author: yanghengfeng
*/
!function (global) {
	//Raphael的arrow扩展
	(!Raphael.fn.rgrapharrow ) && (Raphael.fn.rgrapharrow=function(edge){
	    var getConnection = function(obj1,obj2){
	            /* get bounding boxes of target and source */
	            var bb1 = obj1.getBBox();
	            var bb2 = obj2.getBBox();
	            var off1 = 0;
	            var off2 = 0;
	            /* coordinates for potential connection coordinates from/to the objects */
	            var p = [
	                /* NORTH 1 */
	                { x: bb1.x + bb1.width / 2, y: bb1.y - off1 },
	                /* SOUTH 1 */
	                { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + off1 },
	                /* WEST */
	                { x: bb1.x - off1, y: bb1.y + bb1.height / 2 },
	                /* EAST  1 */
	                { x: bb1.x + bb1.width + off1, y: bb1.y + bb1.height / 2 },
	                /* NORTH 2 */
	                { x: bb2.x + bb2.width / 2, y: bb2.y - off2 },
	                /* SOUTH 2 */
	                { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + off2 },
	                /* WEST  2 */
	                { x: bb2.x - off2, y: bb2.y + bb2.height / 2 },
	                /* EAST  2 */
	                { x: bb2.x + bb2.width + off2, y: bb2.y + bb2.height / 2 }
	            ];
	          
	            /* distances between objects and according coordinates connection */
	            var d = {}, dis = [];

	            /*
	            * find out the best connection coordinates by trying all possible ways
	            */
	            /* loop the first object's connection coordinates */
	            for (var i = 0; i < 4; i++) {
	                /* loop the seond object's connection coordinates */
	                for (var j = 4; j < 8; j++) {
	                    var dx = Math.abs(p[i].x - p[j].x);
	                    var dy = Math.abs(p[i].y - p[j].y);
	                    if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x)
	                        && ((i != 2 && j != 7) || p[i].x > p[j].x)
	                        && ((i != 0 && j != 5) || p[i].y > p[j].y)
	                        && ((i != 1 && j != 4) || p[i].y < p[j].y))){
	                    dis.push(dx + dy);
	                    d[dis[dis.length - 1].toFixed(3)] = [i, j];
	                    }
	                }
	            }
	            var res = dis.length == 0 ? [0, 4] : d[Math.min.apply(Math, dis).toFixed(3)];

	            return {x1:p[res[0]].x,y1: p[res[0]].y,x2:p[res[1]].x,y2:p[res[1]].y};
	        },
	        getPos = function(obj1,obj2){
	            var conn = getConnection(obj1,obj2),fromx = conn.x1,fromy = conn.y1,tox=conn.x2,toy = conn.y2,
	                sign=(tox==fromx)?1:((tox-fromx)/Math.abs(tox-fromx)),
	                c=(tox==fromx)?Math.PI/2:Math.atan((toy-fromy)/(tox-fromx)),
	                triangleX1= (tox-Math.cos(c-Math.PI/12)*10*sign).toFixed(1),
	                triangleY1= (toy-Math.sin(c-Math.PI/12)*10*sign).toFixed(1),
	                triangleX2= (tox-Math.cos(c+Math.PI/12)*10*sign).toFixed(1),
	                triangleY2= (toy-Math.sin(c+Math.PI/12)*10*sign).toFixed(1);
	            return {
	                linestr:"M"+fromx+","+fromy+" L"+tox+","+toy,
	                trianglestr:"M"+tox+","+toy+" L"+triangleX1+","+triangleY1+" L"+triangleX2+","+triangleY2+" L"+tox+","+toy,
	                arrowpos:{
	                    x:(fromx+tox)/2,
	                    y:(fromy+toy)/2,
	                    transform:((fromx+tox)/2)+","+((fromy+toy)/2)+"r"+(c/Math.PI)*180+(c>Math.PI/2?("t8,8"):("t-8,-8"))
	                }
	            }
	        },
	        pos = getPos(edge.source.shape,edge.target.shape),
	        line = this.path(pos.linestr).attr(edge.lineStyle||{}).toBack(),
	        triangle = this.path(pos.trianglestr)
	            .attr({stroke: "#000",fill:"#000","stroke-width":1})
	            .attr(edge.triangleStyle||{})
	            .toBack(),
	        label = this.text(pos.arrowpos.x, pos.arrowpos.y, edge.label||"").attr({fill: "#000", "font-size": "12px"}).transform(pos.arrowpos.transform).attr(edge.labelStyle||{});
	    return {
	        redraw:function(){
	            var pos = getPos(edge.source.shape,edge.target.shape);
	            line.attr("path",pos.linestr);
	            triangle.attr("path",pos.trianglestr);
	            label.attr(pos.arrowpos);
	        }
	    }
	});

	//util methods
    var addEventListener=document.all?(function(ele,eventname,fn){ele.attachEvent("on"+eventname,fn);}):(function(ele,eventname,fn){ele.addEventListener(eventname,fn,false)}),
        getEvent=function(e){
            var evt = window.event?window.event:e;
            (!evt.stopPropagation) && (evt.stopPropagation=function(){evt.cancelBubble=false;});
            (!evt.preventDefault) && (evt.preventDefault= function(){evt.returnValue=false;});
            (!evt.target) && (evt.target= evt.srcElement);
            (!evt.which) && (e.which= e.button);
            return evt;
        },
        //拖拽过程容易产生选中，清除选中对象
        clearSelection = function(){
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        };

    // RGraph definition
	var RGraph  =  global.RGraph = function(domId){
		var me = this;
		me.canvas = document.getElementById(domId);
		me.width = me.canvas.clientWidth;
		me.height = me.canvas.clientHeight;
		me.paper = Raphael(me.canvas, me.width, me.height);
	};
	RGraph.prototype={
		layout:function(){
			var me = this;
			var SpringLayout = function(graph) {
			    this.graph = graph;
			    this.iterations = 500;
			    this.maxRepulsiveForceDistance = 6;
			    this.k = 2;
			    this.c = 0.01;
			    this.maxVertexMovement = 0.5;
			    this.layout();
			};
			SpringLayout.prototype = {
			    layout: function() {
			        this.layoutPrepare();
			        for (var i = 0; i < this.iterations; i++) {
			            this.layoutIteration();
			        }
			        this.layoutCalcBounds();
			    },

			    layoutPrepare: function() {
			        for (i in this.graph.nodes) {
			            var node = this.graph.nodes[i];
			            node.layoutPosX = 0;
			            node.layoutPosY = 0;
			            node.layoutForceX = 0;
			            node.layoutForceY = 0;
			        }

			    },

			    layoutCalcBounds: function() {
			        var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;

			        for (i in this.graph.nodes) {
			            var x = this.graph.nodes[i].layoutPosX;
			            var y = this.graph.nodes[i].layoutPosY;

			            if(x > maxx) maxx = x;
			            if(x < minx) minx = x;
			            if(y > maxy) maxy = y;
			            if(y < miny) miny = y;
			        }

			        this.graph.layoutMinX = minx;
			        this.graph.layoutMaxX = maxx;
			        this.graph.layoutMinY = miny;
			        this.graph.layoutMaxY = maxy;
			    },

			    layoutIteration: function() {
			        // Forces on nodes due to node-node repulsions

			        var prev = new Array();
			        for(var c in this.graph.nodes) {
			            var node1 = this.graph.nodes[c];
			            for (var d in prev) {
			                var node2 = this.graph.nodes[prev[d]];
			                this.layoutRepulsive(node1, node2);

			            }
			            prev.push(c);
			        }

			        // Forces on nodes due to edge attractions
			        for (var i = 0; i < this.graph.edges.length; i++) {
			            var edge = this.graph.edges[i];
			            this.layoutAttractive(edge);
			        }

			        // Move by the given force
			        for (i in this.graph.nodes) {
			            var node = this.graph.nodes[i];
			            var xmove = this.c * node.layoutForceX;
			            var ymove = this.c * node.layoutForceY;

			            var max = this.maxVertexMovement;
			            if(xmove > max) xmove = max;
			            if(xmove < -max) xmove = -max;
			            if(ymove > max) ymove = max;
			            if(ymove < -max) ymove = -max;

			            node.layoutPosX += xmove;
			            node.layoutPosY += ymove;
			            node.layoutForceX = 0;
			            node.layoutForceY = 0;
			        }
			    },

			    layoutRepulsive: function(node1, node2) {
			        if (typeof node1 == 'undefined' || typeof node2 == 'undefined')
			            return;
			        var dx = node2.layoutPosX - node1.layoutPosX;
			        var dy = node2.layoutPosY - node1.layoutPosY;
			        var d2 = dx * dx + dy * dy;
			        if(d2 < 0.01) {
			            dx = 0.1 * Math.random() + 0.1;
			            dy = 0.1 * Math.random() + 0.1;
			            var d2 = dx * dx + dy * dy;
			        }
			        var d = Math.sqrt(d2);
			        if(d < this.maxRepulsiveForceDistance) {
			            var repulsiveForce = this.k * this.k / d;
			            node2.layoutForceX += repulsiveForce * dx / d;
			            node2.layoutForceY += repulsiveForce * dy / d;
			            node1.layoutForceX -= repulsiveForce * dx / d;
			            node1.layoutForceY -= repulsiveForce * dy / d;
			        }
			    },

			    layoutAttractive: function(edge) {
			        var node1 = edge.source;
			        var node2 = edge.target;

			        var dx = node2.layoutPosX - node1.layoutPosX;
			        var dy = node2.layoutPosY - node1.layoutPosY;
			        var d2 = dx * dx + dy * dy;
			        if(d2 < 0.01) {
			            dx = 0.1 * Math.random() + 0.1;
			            dy = 0.1 * Math.random() + 0.1;
			            var d2 = dx * dx + dy * dy;
			        }
			        var d = Math.sqrt(d2);
			        if(d > this.maxRepulsiveForceDistance) {
			            d = this.maxRepulsiveForceDistance;
			            d2 = d * d;
			        }
			        var attractiveForce = (d2 - this.k * this.k) / this.k;
			        if(edge.attraction == undefined) edge.attraction = 1;
			        attractiveForce *= Math.log(edge.attraction) * 0.5 + 1;

			        node2.layoutForceX -= attractiveForce * dx / d;
			        node2.layoutForceY -= attractiveForce * dy / d;
			        node1.layoutForceX += attractiveForce * dx / d;
			        node1.layoutForceY += attractiveForce * dy / d;
			    }
			};
			var layouter  = new SpringLayout(me);
			//draw
			var width = me.width,
				height = me.height,
				radius = 50,
				g = me,
				factorX = (width - 2 * radius) / (g.layoutMaxX - g.layoutMinX);
				factorY = (height - 2 * radius) / (g.layoutMaxY - g.layoutMinY),
				translate = function(point) {
			        return [
			            (point[0] - g.layoutMinX) * factorX + radius,
			            (point[1] - g.layoutMinY) * factorY + radius
			        ];
			    };
			//计算每个节点的坐标
			for (var i = g.nodes.length - 1; i >= 0; i--) {
				var node = g.nodes[i];
				node.point = translate([node.layoutPosX, node.layoutPosY]);
			};
		},
		draw:function(){
			var me = this;
			//绘制节点
			for (var i = me.nodes.length - 1; i >= 0; i--) {
				var node = me.nodes[i];
				node.text = me.paper.text(node.point[0],node.point[1],node.label);
				node.shape = me.paper.rect(node.point[0]-50,node.point[1]-10, 100, 20);
			};
			//画箭头
			for (var i = me.edges.length - 1; i >= 0; i--) {
				var edge = me.edges[i];
				edge.arrow = me.paper.rgrapharrow(edge);
			};
		},
		loadData:function(data) {
			var me  = this;
			//prepare layout
			me.nodes = [];
			me.edges=[];
			for(var nodeid in data.nodes){
				data.nodes[nodeid].nodeid = nodeid;
				me.nodes.push(data.nodes[nodeid]);
			}
			for (var i = data.edges.length - 1; i >= 0; i--) {
				var edge = data.edges[i];
				edge.source = data.nodes[edge.source] || edge.source;
				edge.target = data.nodes[edge.target] || edge.target;
				me.edges.push(edge);
			};
			me.layout();
			me.draw();

		}
	};
}(window)