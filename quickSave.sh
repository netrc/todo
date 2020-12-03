

T=./t.js
S=@save

for d in {19..26} ; do
  D=2020-08-$d
  $T -d $D  > $S/$D
done

$T -t > $S/todo
