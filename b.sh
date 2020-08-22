
T=${HOME}/prod/todo
mkdir -p ${T}

tar cf - t j t.js src | ( cd ${T} ; tar xvf - )

cd ${T}
npm install aws-sdk tmp
