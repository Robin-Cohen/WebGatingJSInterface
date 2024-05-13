library(flowCore)
args <- commandArgs(TRUE)
fs<-read.FCSheader(args[1])
markerFile<-args[2]

keylist<-names(fs[[1]])
collumnN<-grep("P.*N$",keylist)
collumnS<-grep("P.*S$",keylist)
mat<-do.call(rbind, Map(cbind, collumnN, collumnS))
replace<-function(x){
  return(fs[[1]][[x]])
}
mat<-apply(mat,c(1,2), replace)
write.table(mat, file=markerFile, row.names=FALSE, col.names=FALSE)
