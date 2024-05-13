setClass("Gating",
         representation=representation(marker1="character",marker2="character",data="flowFrame",gates="list")
)

setMethod(
  f="initialize",
  signature = "Gating",
  definition = function(.Object,marker1,marker2,data){
    if(!(isFCSfile(data))){
      stop(paste(data,"not a FCS file"))
    }
    .Object@data<-read.FCS(data)
    .Object@marker1 <- marker1
    .Object@marker2 <- marker2
    .Object@gates <- list()
    return(.Object)
    
  }
)
setGeneric("gateRectangle",function(object,x1,y1,x2,y2){
  standardGeneric("gateRectangle")
})

setMethod(
  "gateRectangle",
  "Gating",
  function(object,x1,y1,x2,y2){
    mat <- matrix(c(min(x1,x2), max(x1,x2), min(y1,y2), max(y1,y2)), ncol=2, dimnames=list(c("min", "max"),c(object@marker1, object@marker2)))
    rg <- rectangleGate(filterId="myRectGate", .gate=mat)
    return(rg)
  }
)

setGeneric("gatePolygon",function(object,listCoordinates){
  standardGeneric("gatePolygon")
})
setMethod(
  "gatePolygon",
  "Gating",
  function(object,listCoordinates){
    mat<-matrix(listCoordinates,ncol=2,nrow=length(listCoordinates)/2)
    colnames(mat) <-c(object@marker1,object@marker2)
    pg <- polygonGate(filterId="polygonGate",.gate=mat)
    return(pg)
  }
)

convertScaleToLog<-function(minLinear,maxLinear,minLog,maxLog,X){  #based on formula :X = a + b * log(x)
  b = (maxLinear - minLinear) / log10(maxLog / minLog)
  a = minLinear - b * log10(minLog)
  return (10^((X-a)/b))
}

handlePolygon<-function(polygonElements,convertScale,maxXValue,maxYValue){
  nbValue= length(polygonElements)
  rawList<-c()
  for (i in 2:nbValue){
    x<-polygonElements[[i]]$x
    if(convertScale){
      x<-convertScaleToLog(0,700,0.01,maxXValue,polygonElements[[i]]$printX)
    }
    rawList[i-1]<-x
  }
  for (i in 2:nbValue){
    y<-polygonElements[[i]]$y
    if(convertScale){
      
      y<-convertScaleToLog(0,700,0.01,maxYValue,polygonElements[[i]]$printY)
      
    }
    rawList[nbValue+i-2]<-y
  }
  gate<-gatePolygon(gate,rawList)
  return(gate)
}

selectMethod<-function(Jsondata,convertScale=FALSE,maxXValue,maxYValue){
  a<-list()
  dataType<-Jsondata$type
  if (dataType=="rectangle"){
    if(convertScale){
      x<-convertScaleToLog(0,700,0.01,maxXValue,Jsondata$printX)
      y<-convertScaleToLog(0,700,0.01,maxXValue,Jsondata$printY)
      x2<-convertScaleToLog(0,700,0.01,maxXValue,Jsondata$printX2)
      y2<-convertScaleToLog(0,700,0.01,maxXValue,Jsondata$printY2)
      selectGate<-gateRectangle(gate,x,y,x2,y2)
    }
    else{
      selectGate<-gateRectangle(gate,Jsondata$x,Jsondata$y,Jsondata$x2,Jsondata$y2)
    }
    return(selectGate)
  }
  else if (dataType=="polygon"){
    selectGate<-handlePolygon(Jsondata,convertScale,maxXValue,maxYValue)
    return(selectGate)
  }
}
  mergeAllGate<-function(listOfGate){
      listOfGate<-listOfGate[!sapply(listOfGate,is.null)]
      if(length(listOfGate)>1){
        
        toBeFiltered <- listOfGate[[1]]
        for(filter in 2:length(listOfGate)){
          toBeFiltered<- toBeFiltered | listOfGate[[filter]] # '|' symbol merge two gate set
        }
      }
      else{
        toBeFiltered<-listOfGate[[1]]
      }
      return(toBeFiltered)
    }
    
    plotByMarker<-function(originalData,gatedData,marker1,marker2,path){
      
      png(file=path, width=700, height=700)
      par(mar = rep(0,4))
      suppressWarnings(plot(x=exprs(gatedData)[,marker1], y=exprs(gatedData)[,marker2], pch=".", xlim=c(0.01,max(exprs(originalData)[,marker1])), ylim=c(0.01,max(exprs(originalData)[,marker2])),xaxs="i",yaxs="i",log="xy",xlab=marker1, ylab=marker2))
      dev.off()
    }
    
    
    
    getMaxValue<-function(marker1,marker2,file){
      original<-file
      print(marker1)
      marker1value <- max(exprs(original)[,marker1])
      print(marker1value)
      marker2value <- max(exprs(original)[,marker2])
      
      return(c(marker1value,marker2value))
    }
