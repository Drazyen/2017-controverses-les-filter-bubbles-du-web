

$(document).ready(function () {
    var arbre = {};
    var liste = [];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "./assets/debats.json", false);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            arbre = JSON.parse(xmlhttp.responseText);
        }
    };
    xmlhttp.send(null);
    
    var res = getList(arbre, liste);
    
    var bubbleChart = createBubbleChart(res);
    
    setListener(bubbleChart, arbre, liste);
});


function setListener(bubbleChart, arbre, liste) {
    $(".node").on("click", function () {
        var index = bubbleChart.getClickedNode()[0][0].__data__.item.index;
        console.log("index : ", index);
        if (index === 0) {
            liste = liste.slice(0, liste.length-1);
            res = getList(arbre, liste);
            reloadChart(res, bubbleChart, arbre, liste);
            setListener(bubbleChart, arbre, liste);
        }
        else {
            liste.push(index-1);
            res = getList(arbre, liste);
            reloadChart(res, bubbleChart, arbre, liste);
            setListener(bubbleChart, arbre, liste);
        }
    });
}


function reloadChart(res, bubbleChart, arbre, liste) {
    if (res === null) {
        console.log("coucou");
    }
    else {
        $(".bubbleChart").empty();
        bubbleChart = createBubbleChart(res);
        console.log("liste :", res);
    }
}


function getList(tree, list) {
    if (list.length === 0 && typeof tree.children === "undefined") {
        createModalWindow("","");
        return null;
    } 
    else if (list.length === 0) {
        var res = [];
        res.push({"text" : tree.name, "count" : 60, "index" : 0});
        var i = 0;
        for (var i = 0; i < tree.children.length; i++) {
            res.push({"text" : tree.children[i].name, "count" : 2, "index" : i+1})
        }
        return res;
    }
    else {
        var treeBis = tree.children[list[0]];
        var listBis = list.slice(1, list.length);
        return getList(treeBis, listBis);
    }
}


function createModalWindow(text, img) {
    //Faire apparaitre la pop-up et ajouter le bouton de fermeture
	$("#popup").fadeIn().css({
		'width': Number(500)
	})
	.prepend('<a href="#" class="close"><img src="./assets/cross.jpeg" class="btn_close" title="Fermer" alt="Fermer" /></a>');
    
    //Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
	var popMargTop = ($("#popup").height() + 80) / 2;
	var popMargLeft = ($("#popup").width() + 80) / 2;
    
    //On affecte le margin
    $("#popup").css({
		'margin-top' : -popMargTop,
		'margin-left' : -popMargLeft
	});
    
    //Effet fade-in du fond opaque
	$('body').append('<div id="fade"></div>'); //Ajout du fond opaque noir
	//Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
	$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
    
    //Fermeture de la pop-up et du fond
    $('a.close, #fade').on('click', function() { //Au clic sur le bouton ou sur le calque...
        $('#fade , .popup_block').fadeOut(function() {
            $('#fade, a.close').remove();  //...ils disparaissent ensemble
        });


        return false;
    });

	return false;
}


function createBubbleChart(list) {
    return new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
        
    
        
    data: {
      items: list,
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      /*{
        name: "central-click",
        options: {
          text: "",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            //alert("Here is more details!!");
          }
        }
      },*/
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
}