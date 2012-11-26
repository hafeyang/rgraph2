/**
* 	RGraph Version 2
*	graph implementation by Raphael
*	@author: yanghengfeng
*/
!function (global) {
	//Raphael的arrow扩展
	(!Raphael.fn.rgrapharrow ) && (Raphael.fn.rgrapharrow=function(edge,rgraph){
	    var paper=this,getConnection = function(obj1,obj2){
	            /* get bounding boxes of target and source */
	            var bb1 = obj1.getBBox();
	            var bb2 = obj2.getBBox();

	            //adjustx:在IE下getBBox获取的坐标没有算上_viewBox中的部分。
		        //直接访问_viewBox不是好的做法，但是Raphael并没有提供接口访问该属性
		        //对象getBBox()在IE下xy坐标有问题
		        /*var adjustx=(document.all?(paper._viewBox||[0,0])[0]:0),
		        	adjusty=(document.all?(paper._viewBox||[0,0])[1]:0);
		        bb1.x = bb1.x+adjustx;
		        bb1.y = bb1.y+adjusty;
		        bb2.x = bb2.x+adjustx;
		        bb2.y = bb2.y+adjusty;*/
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
	        pos = getPos(edge.source._shapes,edge.target._shapes),
	        line = this.path(pos.linestr).attr(edge.lineStyle||{}).toBack(),
	        triangle = this.path(pos.trianglestr)
	            .attr({stroke: "#000",fill:"#000","stroke-width":1})
	            .attr(edge.triangleStyle||{})
	            .toBack(),
	        label = this.text(pos.arrowpos.x, pos.arrowpos.y, edge.label||"")
	        	.attr({fill: "#000", "font-size": "12px"})
	        	.transform(pos.arrowpos.transform)
	        	.attr(edge.labelStyle||{});
	    return {
	        redraw:function(){
	            var pos = getPos(edge.source._shapes,edge.target._shapes);
	            line.attr("path",pos.linestr);
	            triangle.attr("path",pos.trianglestr);
	            label.attr(pos.arrowpos).transform(pos.arrowpos.transform);
	            label.attr({x:pos.arrowpos.x,y:pos.arrowpos.y});
	        },
	        //高亮箭头时会调用该方法
	    	highlight:function(){
	    		triangle.data("_normal",{
	    			stroke:triangle.attr("stroke"),
	    			fill: triangle.attr("fill")
	    		});
	    		triangle.attr({"stroke":"#FF9900","fill":"#FF9900"});

	    		line.data("_normal",{
	    			stroke:line.attr("stroke"),
	    			fill: line.attr("fill")
	    		});
	    		line.attr({"stroke":"#FF9900","fill":"#FF9900"});

	    		label.data("_normal",{
	    			stroke:label.attr("stroke"),
	    			fill: label.attr("fill")
	    		});
	    		label.attr({"stroke":"#FF9900","fill":"#FF9900"});
	    	},
	    	//清除高亮
	    	unhighlight:function(){
	    		triangle.attr(triangle.data("_normal"));
	    		label.attr(label.data("_normal"));
	    		line.attr(line.data("_normal"));
	    	}
	    }
	});

	(!Raphael.fn.rgraphnode ) && (Raphael.fn.rgraphnode=function(node){
		var paper = this,
			text = Raphael.fullfill(node.label,node)||"",
			getSize  = function(text){
				var rows = text.split("\n"),h = rows.length*14,w=0;
				for (var i = rows.length - 1; i >= 0; i--) {
					var row = rows[i];
					if(row.length*12 > w ){
						w = row.length*12;
					}
				};
				return {w:w,h:h};
			},
			size = getSize(text);
		
		node._shape = paper.rect(node.point[0]-size.w/2,node.point[1]-size.h/2, size.w, size.h,3)
			.attr({stroke: "#ccc",fill:"#ccc","stroke-width":1,"cursor":"pointer"})
			.attr(node.rectStyle||{});
		node._text = paper.text(node.point[0],node.point[1],text).attr({"cursor":"pointer","font-size":12}).attr(node.textStyle||{});
	    return {
	    	//移动节点时会调用该方法
	    	move:function(dx,dy){
	    		node._shape.transform("...t"+dx+","+dy);
	    		node._text.transform("...t"+dx+","+dy);
	    	},
	    	//高亮节点时会调用该方法
	    	highlight:function(){
	    		node._shape.data("_normal",{
	    			stroke:node._shape.attr("stroke"),
	    			fill: node._shape.attr("fill")
	    		});
	    		node._shape.attr({"stroke":"#FF9900","fill":"#FFFF66"});
	    	},
	    	//清除高亮
	    	unhighlight:function(){
	    		node._shape.attr(node._shape.data("_normal"));
	    	},
	    	//更新节点文本
	    	update:function(){
	    		var text = Raphael.fullfill(node.label,node)||"",size = getSize(text);
	    		node._shape.attr({x:node.point[0]-size.w/2,y:node.point[1]-size.h/2,width:size.w,height:size.h});
	    		node._text.attr({text:text});
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
	var RGraph  =  global.RGraph = function(domId,opts){
		var me = this;
		me.canvas = document.getElementById(domId);
		me.width = me.canvas.clientWidth;
		me.height = me.canvas.clientHeight;
		me.paper = Raphael(me.canvas, me.width, me.height);
		me.nodes = [];
		me.edges=[];
		me._bind();
		for (var opt in opts||{}) {
			me[opt]= opts[opt];
		};
	};
	RGraph.prototype={
		// 绑定事件
		_bind:function(){
			var me  = this,c = me.canvas,wheel= function(e){//wheel event
                var evt = getEvent(e),viewbox=me.getViewBox(),delta = evt.wheelDelta?(evt.wheelDelta/120):(-evt.detail/3),
                    basePoint={x:viewbox.x+evt.clientX,y:viewbox.y+evt.clientY};
                me.setZoom(me.getZoom()*(1+delta*0.1),basePoint);
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            } 
            try{
                addEventListener(c,"mousewheel",wheel);//IE+webkit
                addEventListener(c,"DOMMouseScroll",wheel);//firefox
            }catch(e){}

            //drag event
            me.canvasdragging= false;
            me.nodedragging=false;
            addEventListener(c,"mousedown",function(e){
                var evt = getEvent(e),drag = false,viewbox= me.getViewBox(),
                	node = me.paper.getElementByPoint(evt.clientX,evt.clientY);
                if(e.which!=1) return ;//非右键无效
                if(evt.target.parentNode==me.canvas){//拖动canvas
                    me.canvasdragging={x:evt.clientX,y:evt.clientY,timestamp:(new Date()).getTime()};
                    me.canvas.style.cursor="move";
                }

                if(node && node.data("nodeId")){//拖动节点
                    var nodeId = node.data("nodeId"),draggingnode = me.getNode(nodeId);
                    me.nodedragging={x:evt.clientX,y:evt.clientY,node:draggingnode,_x:evt.clientX,_y:evt.clientY,timestamp:(new Date()).getTime()};
                    draggingnode._shapes.attr({"cursor":"move"}).toFront();
                }        
            });
            addEventListener(c,"mousemove",function(e){
                var evt = getEvent(e),viewbox=me.getViewBox(),now = (new Date()).getTime(),
                	hovernode  = me.paper.getElementByPoint(evt.clientX,evt.clientY);
                clearSelection();
                //记录上次canvasdragging触发的时间戳，减速canvasdragging触发的频率
                if(me.canvasdragging && now-me.canvasdragging.timestamp >100 ){
                    var x = parseInt((me.canvasdragging.x-evt.clientX)/me.getZoom()),
                        y = parseInt((me.canvasdragging.y-evt.clientY)/me.getZoom()),
                        viewbox = me.getViewBox();
                    me.canvasdragging={x:evt.clientX,y:evt.clientY};
                    me.setViewBox(viewbox.x+x,viewbox.y+y,viewbox.w,viewbox.h);
                    me.canvasdragging.timestamp= now;
                }
                if(me.nodedragging && now-me.nodedragging.timestamp >200){

                    var nodedragging=me.nodedragging,
                        dx = ((evt.clientX-nodedragging.x)/me.getZoom()).toFixed(3),
                        dy = ((evt.clientY-nodedragging.y)/me.getZoom()).toFixed(3),
                        node = nodedragging.node,
                        edges  = me.getNodeEdges(node.nodeId);
                    //console.log(evt.clientX+","+evt.clientY+" "+dx+","+dy);
                    node._node.move(dx,dy);
                    for (var i = edges.length - 1; i >= 0; i--) {
                    	edges[i].arrow.redraw();
                    };
                    me.nodedragging.timestamp= now;
                    me.nodedragging.x = evt.clientX;
                    me.nodedragging.y = evt.clientY;
                }
                //鼠标放在节点上，高亮节点和相关的箭头
                //排除现有行为
                if(me.canvasdragging || me.nodedragging) {return;}
                if(hovernode && hovernode.data("nodeId")){
                    me.hovernode = me.getNode(hovernode.data("nodeId"));
                    if(me._lastHoverNode!=me.hovernode){//进入node
                        if(me._lastHoverNode ){ //触发之前节点的unhighlight
                            var edges  = me.getNodeEdges(me._lastHoverNode.nodeId);
                            me._lastHoverNode._node.unhighlight();
                            for (var i = edges.length - 1; i >= 0; i--) {
                            	edges[i].arrow.unhighlight();
                            };
                            (me.onnodemouseout||function(){}).call(me,me._lastHoverNode);
                        }
                        me.hovernode._node.highlight();
                       	var edges  = me.getNodeEdges(me.hovernode.nodeId);
                        for (var i = edges.length - 1; i >= 0; i--) {
                        	edges[i].arrow.highlight();
                        };
                        (me.onnodemouseover||function(){}).call(me,me.hovernode);
                    }
                    me._lastHoverNode = me.hovernode;
                }else{
                    if(me._lastHoverNode){
                        var edges  = me.getNodeEdges(me._lastHoverNode.nodeId);
                        me._lastHoverNode._node.unhighlight();
                        for (var i = edges.length - 1; i >= 0; i--) {
                        	edges[i].arrow.unhighlight();
                        };
                        (me.onnodemouseout||function(){}).call(me,me._lastHoverNode);
                        me._lastHoverNode=null;
                    }
                }
            });
            addEventListener(c,"mouseup",function(e){
                var evt = getEvent(e);
                clearSelection();
                if(me.canvasdragging){
                    me.canvasdragging=false;
                    me.canvas.style.cursor="auto";
                }
                if(me.nodedragging){
                    var nodedragging=me.nodedragging,
                        node = nodedragging.node;
                    node._shapes.attr({"cursor":"pointer"});
                    if(evt.clientX==nodedragging._x && evt.clientY==nodedragging._y){//如果没有拖动位置，说明是点击
                        if(typeof(me.onnodeclick)=="function") me.onnodeclick.call(me,node);
                    }
                    me.nodedragging = false;
                }
            });
		},
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
			var radius = 50,
				width = me.nodes.length*radius*2.2,
				height = me.nodes.length*radius*1.4,
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
		_drawNode:function(node){
			var me = this,
				drawNodeFn = typeof me.drawNodeFn =="function" ? me.drawNodeFn : me.paper[me.drawNodeFn||"rgraphnode"];
			me.paper.setStart();
			node._node = drawNodeFn.call(me.paper,node);
			node._shapes = me.paper.setFinish();
			node._shapes.data("nodeId",node.nodeId);//节点绘制的所有元素都标记上nodeId
		},
		_drawEdge:function(edge){
			var me =this;
			me.paper.setStart();
			edge.arrow = me.paper.rgrapharrow(edge,me);
			edge._shapes = me.paper.setFinish();
		},
		draw:function(){
			var me = this;
			me.paper.clear();
			//绘制节点
			for (var i = me.nodes.length - 1; i >= 0; i--) {
				me._drawNode(me.nodes[i]);
			};
			//画箭头
			for (var i = me.edges.length - 1; i >= 0; i--) {
				me._drawEdge(me.edges[i]);
				
			};
		},
		removeNode:function(nodeId){
			var me = this ,node = me.getNode(nodeId),edges = me.getNodeEdges(nodeId);
			if(!node && !edges) return false;
			for (var i = edges.length - 1; i >= 0; i--) {
				edges[i]._shapes && (edges[i]._shapes.remove());
			};
			node._shapes && (node._shapes.remove());
			for (var i = me.edges.length - 1; i >= 0; i--) {
				var edge = me.edges[i];
				if(edge.source == node  || edge.target == node){
					edges.splice(i,1);
				}
			}
			for (var i = me.nodes.length - 1; i >= 0; i--) {
        		if(me.nodes[i].nodeId == nodeId){
        			me.nodes.splice(i,1);
        			break;
        		}
        	}
        	return true;
		},
		updateNode:function(nodeId){
			var me = this ,node = me.getNode(nodeId),edges = me.getNodeEdges(nodeId);
			if(!node && !edges) return false;
			node._node.update();
			for (var i = edges.length - 1; i >= 0; i--) {
				edges[i].arrow.redraw();
			};
		},
		addNode:function(node){
			var me = this,vb = me.getViewBox();
			if(!node.nodeId || me.getNode(node.nodeId)) return false;
			node.point=[vb.x+Math.random()*vb.w,vb.y+Math.random()*vb.h];
			me.nodes.push(node);
			me._drawNode(node);
			return true;
		},
		existEdge:function(sourceNodeId,targetNodeId){
			for (var i = this.edges.length - 1; i >= 0; i--) {
				var edge = this.edges[i];
				if(edge.source.nodeId == sourceNodeId  && edge.target.nodeId == targetNodeId){
					return true;
				}
			}
			return false;
		},
		addEdge:function(edge){
			var me =this;
			edge.source = me.getNode(edge.source);
			edge.target = me.getNode(edge.target);
			if(!edge.source || !edge.target || me.existEdge(edge.source.nodeId,edge.target.nodeId)) return false;
			me._drawEdge(edge);
			me.edges.push(edge);
			return true;
		},
		loadData:function(data) {
			var me  = this;
			//prepare layout
			me.nodes = [];
			me.edges=[];
			for(var nodeid in data.nodes){
				data.nodes[nodeid].nodeId = nodeid;
				me.nodes.push(data.nodes[nodeid]);
			}
			for (var i = data.edges.length - 1; i >= 0; i--) {
				var edge = data.edges[i];
				edge.source = data.nodes[edge.source] || edge.source;
				edge.target = data.nodes[edge.target] || edge.target;
				me.edges.push(edge);
			};
			me.reset();
			me.layout();
			me.draw();
		},
		relayout:function(){
			var me = this,graphData = {nodes:[],edges:[]};
			for (var i = me.edges.length - 1; i >= 0; i--) {
				var edge = me.edges[i];
				edge.source = edge.source.nodeId;
				edge.target = edge.target.nodeId;
				graphData.edges.push(edge);
			};

			for (var i = me.nodes.length - 1; i >= 0; i--) {
				var node = me.nodes[i];
				graphData.nodes[node.nodeId] = node;
			};
			me.loadData(graphData);
		},
		getNode:function(nodeId){
			var me =this,node = null;
        	for (var i = me.nodes.length - 1; i >= 0; i--) {
        		if(me.nodes[i].nodeId == nodeId){
        			node = me.nodes[i];
        			break;
        		}
        	};
        	return node;
		},
		//根据nodeId获取Edges
		getNodeEdges:function(nodeId){
			var me= this,edges = [],node = me.getNode(nodeId);
			if(!node) return edges;
			for (var i = me.edges.length - 1; i >= 0; i--) {
				var edge = me.edges[i];
				if(edge.source == node  || edge.target == node){
					edges.push(edge);
				}
			};
			return edges;
		},
		setViewBox:function(x,y,w,h,fit){
            var me =this;
            me.x=x;
            me.y=y;
            me.w=w;
            me.h=h;
            return me.paper.setViewBox(x,y,w,h,fit);
        },
        getViewBox:function(){
            return {x:this.x,y:this.y,w:this.w,h:this.h};
        },
        getZoom:function(){return this.zoom;},
        reset:function(){
            this.zoom=1;
            this.setViewBox(0,0,this.width,this.height);
        },
        setZoom:function(zoom,basePoint){
            var me=this,viewbox=me.getViewBox();
            if(!basePoint){
                basePoint  = {x:viewbox.x+viewbox.w/2,y:viewbox.y+viewbox.h/2};
            }
            viewbox.x +=parseInt((basePoint.x-viewbox.x)*(1/me.zoom-1/zoom));
            viewbox.y +=parseInt((basePoint.y-viewbox.y)*(1/me.zoom-1/zoom));
            me.zoom= zoom;
            viewbox.w=parseInt(me.paper.width/me.zoom);
            viewbox.h=parseInt(me.paper.height/me.zoom);
            me.setViewBox(viewbox.x,viewbox.y,viewbox.w,viewbox.h);
        },
        /*移动画布，将某一个节点移动至画布中央*/
        center:function(nodeId){
        	var me =this,node = me.getNode(nodeId),vb = me.getViewBox();
        	if(!node || !node.point) return ;
        	vb.x = node.point[0]-me.width/2;
        	vb.y = node.point[1]-me.height/2;
        	me.setViewBox(vb.x,vb.y,vb.w,vb.h);
        }
	};
}(window)