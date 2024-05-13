
library(rjson)
library(flowCore)
args <- commandArgs(TRUE)
request <- fromJSON(file = args[1]) 
source('./gating.R')
fcsFile=request$parentFile
gate<-paste("gate",request$gateNumber,sep = "")
imglocation<-args[3]
fcsLocation<-args[2]
newJson<-args[4]
orginalFCSpath<-args[5]

originalFile<-read.FCS(args[5])
maxValue<-getMaxValue(request$toPlot$marker1,request$toPlot$marker2,originalFile)


gate<-new(Class="Gating",marker1=request$fcsInformation$marker1,marker2=request$fcsInformation$marker2,data=fcsFile)
filterList<-sapply(request$gate, selectMethod)
finalGate<-mergeAllGate(filterList)
fres <- filter(gate@data, finalGate)
fs<-Subset(gate@data,fres)
plotByMarker(gate@data,fs,request$toPlot$marker1,request$toPlot$marker2,imglocation)
write.FCS(fs,fcsLocation)
request$toPlot$marker1Value<-maxValue[1]
request$toPlot$marker2Value<-maxValue[2]
write(toJSON(request), file=newJson)

toSend<-paste(maxValue[1],maxValue[2],request$toPlot$marker1,request$toPlot$marker2,basename(fcsLocation),imglocation)
cat(toSend)

