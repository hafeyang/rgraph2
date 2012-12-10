##RGraph2

RGraph��һ������[Raphaeljs](http://raphaeljs.com/)�����ĵ�->��ͼ��webʵ�֡�

online demo ��[RGraph2 Demo](http://hafeyang.github.com/rgraph2/)

github��ַ :

    git clone https://github.com/hafeyang/rgraph2.git

ʹ�ð�����![xRelation](https://raw.github.com/hafeyang/rgraph2/master/xrelation.png)

RGraph�������ԣ�

* ��->��ͼ�����㷨(2.0����)
* ����������ק
* ���϶������hover������ص�
* ֧�ַŴ�/��С/�������¼�
* �ṩAPI��/ɾ/�Ľڵ�

##Quick Demo

	<script type="text/javascript" src="https://raw.github.com/hafeyang/rgraph2/master/lib/raphael-min.js"></script>
	<script type="text/javascript" src="https://raw.github.com/hafeyang/rgraph2/master/lib/rgraph2.js"></script>
	<script type="text/javascript">
	var graph = new RGraph("canvas");
	//��������
	graph.loadData({
		nodes:{
			//label����ʾ���֣�֧��Raphael.fullfill��ʽ��
			//rectStyle,textStyle �ı������ɫ��������ɫ
			"1":{"label":"{name}",name:"�ڵ�1",rectStyle:{fill:"#616130",stroke:"#616130"},textStyle:{fill:"#fff"}},
			"2":{"label":"�ڵ�2"}
		},
		edges:[
			//source,target �ǽڵ��ID ����ͷ��source->target
			//arrowStyle,ָ����ͷ��ɫ
			{source:"1",target:"2",label:"1->2",arrowStyle:{fill:"#ab4",stroke:"#ab4"}}
		]
	});
	//��IDΪ1�Ľڵ������ӿ�����
	graph.center("1");
	</script>

##��ʼ������

	var graph = new RGraph("canvas",opts);

###opts.drawNodeFn

���ƽڵ��Raphaeljs��չ������Ĭ��Ϊ`rgraphnode`,RGraph2�ڲ�Ĭ��ʵ�֣��Զ���ڵ���Ʒ���Ϊ��

    (!Raphael.fn.rgraphnode ) && (Raphael.fn.rgraphnode=function(node){
        // your implementation
	    return {
	    	//�ƶ��ڵ�ʱ����ø÷���
	    	move:function(dx,dy){},
	    	//�����ڵ�ʱ����ø÷���
	    	highlight:function(){},
	    	//�������
	    	unhighlight:function(){},
	    	//���½ڵ��ı�
	    	update:function(){}
	    }
	});

������Բμ�RGraph2�ڲ�ʵ��

###opts.onnodeclick(e,node)

�ڵ�ڵ㴥��`function`������`event,node`

###opts.onnodemouseover(e,node)

�ڵ�mouseover����`function`������`event,node`

###opts.onnodemouseout(e,node)

�ڵ�mouseout����`function`������`event,node`

###opts.nnodestartdrag(e,node)

�ڵ㿪ʼ��ק����`function`������`event,node`

###opts.onnodedragging(e,node)

�ڵ���ק�д���`function`������`event,node`


###opts.onnodeenddrag(e,node)

�ڵ���ק��������`function`������`event,node`


###API

    ���÷�����graphInstance.method()

###instance.removeNode(nodeId)

ɾ���ڵ��Լ��ڵ���ص���

###instance.updateNode(nodeId)

���½ڵ��ı�

    var node = graphInstance.getNode("nodeId");
    node.label = "{name} after update";
    graphInstance.updateNode(node.nodeId);

###instance.getNode(nodeId)

���ݽڵ�ID��ȡ�ڵ����

###instance.addNode(node)

��ӽڵ㣬�ڵ������`nodeId`,`label`���ԣ�`rectStyle`���ڶ���ڵ�߿���ʽ����ʽ��ʽ���[Raphaeljs Element.attr]("http://raphaeljs.com/reference.html#Element.attr")��`textStyle`����������ʽ��

�������ֽڵ�λ���ӿ��������

    graphInstance.addNode({nodeId:"nodeId---",label:"{nodename}",nodename:"Name"});

###instance.existEdge(sourceNodeId,targetNodeId)

�Ƿ����sourceNode��targetNode֮����ߣ�����з��ظ�Edge���󣬷��򷵻�false

###instance.addEdge(edge)

���һ���ߣ�edge������`source`,`target`���Լ�ͷ��source->target��`label`���Զ����ͷ�ϵ�label���֡�arrowStyle�����ͷ����ɫ��ʽ����ʽ�Լ��������õ����Բμ�[Raphaeljs Element.attr]("http://raphaeljs.com/reference.html#Element.attr")

###instance.loadData(graphData)

����ͼ���ݣ����ݸ�ʽ��demo

###instance.relayout()

���²��ֵ�->��λ��

###instance.getNodeEdges(nodeId)

����nodeId��ȡ�ڵ���صı�

###instane.reset()

�����������ó�1���ӿڻ�ԭ��

###instance.center(nodeId)

��nodeId�ڵ������ӿ�����

##References

[Raphaeljs](http://raphaeljs.com/)

[Graph JavaScript framework](http://snipplr.com/view/1950/graph-javascript-framework-version-001/)

[Graph visualization code in javascript](http://stackoverflow.com/questions/7034/graph-visualization-code-in-javascript)

[JavaScript Graph Library Showcase](http://www.graphdracula.net/showcase/)


##Knows Issues

`Raphaeljs` `Element.getBBox`������IE<9�»�ȡֵ����ȷ����IE9�²��ܼ���


<hr/>

Thanks��any questions ,contact me freely!



