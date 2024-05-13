library(flowCore, lib.loc="./lib")
library(rjson,lib.loc="./lib")


args <- commandArgs(TRUE)
file <-args[1]
marker1<- args[2]
marker2 <- args[3]
tempPng <- args[4]
key <-args[6]

fs<-read.FCS(file)
marker1value <- max(exprs(fs)[,marker1])
marker2value <- max(exprs(fs)[,marker2])

png(filename=tempPng, width=700, height=700)
par(mar = rep(0,4))
suppressWarnings(plot(x=exprs(fs)[,marker1], y=exprs(fs)[,marker2], pch=".", xlim=c(0.01,max(exprs(fs)[,marker1])), ylim=c(0.01,max(exprs(fs)[,marker2])),xaxs="i",yaxs="i",log="xy"))
dev.off()

values<-list(toPlot=c(marker1=marker1,marker2=marker2,marker1Value=marker1value,marker2Value=marker2value))
values<-toJSON(values)
write(values,args[5])

cat(paste(marker1value,marker2value,marker1,marker2,basename(file)))