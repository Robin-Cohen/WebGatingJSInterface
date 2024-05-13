library(rjson)
library(flowCore)
args <- commandArgs(TRUE)
jsonFile=fromJSON(file=args[1])

browseTreeForAllGales<-function(tree){
  listofGate<-list(list(json=tree["json"][[1]],png=tree["pngpath"],fcs=tree["fcspath"],jsonPath=tree["jsonPath"]))
  if(!is.null(tree$children)){
  for(i in 1:length(tree$children)){
    listofGate <- append(listofGate,browseTreeForAllGales(tree$children[[i]]))
  }}
  
  return(listofGate)
}
gateList<-browseTreeForAllGales(jsonFile)
orignalFile<-read.FCS(gateList[[1]]$fcs[[1]])
source('./gating.R')
for (i in 2:length(gateList)) {
  request<-gateList[[i]]
  fcsLocation<-request$fcs
  imglocation<-request$png
  fcsFile <- request$json$parentFile
  jsonPath<- request$jsonPath[[1]]
  
  maxValue<-getMaxValue(request$json$toPlot$marker1,request$json$toPlot$marker2,orignalFile)
  request$json$toPlot$marker1Value<-maxValue[1]
  request$json$toPlot$marker2Value<-maxValue[2]
  
  gate<-new(Class="Gating",marker1=request$json$fcsInformation$marker1,marker2=request$json$fcsInformation$marker2,data=fcsFile)
  filterList<-sapply(request$json$gate, selectMethod,TRUE,maxValue[1],maxValue[2])
  finalGate<-mergeAllGate(filterList)
  fres <- filter(gate@data, finalGate)
  fs<-Subset(gate@data,fres)
  plotByMarker(gate@data,fs,request$json$toPlot$marker1,request$json$toPlot$marker2,imglocation)
  write.FCS(fs,filename=fcsLocation[[1]])
  write(toJSON(request$json), file=jsonPath)
  cat(maxValue[1],maxValue[2],request$json$toPlot$marker1,request$json$toPlot$marker2,"gate1.fcs",imglocation)
}