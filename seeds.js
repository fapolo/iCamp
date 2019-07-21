const mongoose = require("mongoose");
const Acampamento = require("./models/acampamento");
const Comentario = require("./models/comentario");

const acampamentos = [
    {
        name: "Parque da Cachoeira",
        img: "http://ondeacampar.com.br/wp-content/uploads/Parque-da-Cachoeira-Canela-4.jpg",
        desc: "O Parque da Cachoeira está localizado a 16 km do centro de Canela. O parque oferece muitas atividades de lazer e por si só já é um atrativo turístico. A área de camping é bastante grande e fica em meio a uma mata de pinus. O parque possui diversas opções de atividades radicais, como rapel, pêndulo, tirolesa, escalada, cascading, etc. Mas para qualquer uma delas é preciso fazer agendamento. Além disso, também é possível fazer trilhas, andar a cavalo e tomar banho de cachoeira no Rio Cará. Suas trilhas desvendam verdadeiras belezas naturais e é o retiro ideal para uma comunhão com a natureza."
    },{
        name: "Parque Cachoeira dos Borges",
        img: "http://ondeacampar.com.br/wp-content/uploads/Camping-e-Parque-Cachoeira-dos-Borges-4.jpg",
        desc: "Num dos remanescentes mais vistosos de Mata Atlântica primária de toda a região de Aparados da Serra, o Cachoeira dos Borges – Camping e Parque, é seu contato mais direto com a natureza. Localizado no vale do rio Invernada, na localidade de Roça da Estância em Mampituba, RS, esta área foi organizada turisticamente pelo Pedra Afiada e Expedição Caá-etê Ecoturismo. Além de uma belíssima trilha de 30 minutos a esta cachoeira fabulosa, de 70 metros de altura; o Camping e Parque conta com toda a estrutura necessária para o melhor acampamento: banheiros todo azulejado com pia em granito e calefação, área de serviço, recepção com mini-loja de conveniências, piscina natural no rio, duchas externas, 25 lotes com grama esmeralda, estacionamento."
    },{
        name: "Parque do Sesi",
        img: "http://ondeacampar.com.br/wp-content/uploads/Parque-do-Sesi-11.jpg",
        desc: "O espaço oferece infraestrutura completa para você e sua família aproveitarem o melhor da Serra Gaúcha. Local ideal para lazer e descanso em meio a natureza. Venha nos visitar e desfrute de bons momentos junto à natureza."
    }
]

const comentario = {
    text: "Comentário padrão do arquivo seedDB, para testar comentários.",
    author: "Fabricio Polo"
}

function seedDB() {
    Acampamento.deleteMany({}, (err) => {
        if (err) {
            console.log("=== Erro ao remover todos os acampamentos ===");
            console.log(err);
        } else {
            console.log("=== Acampamentos Removidos por completo ===");
            console.log("=== Adicionando novos Acampamentos ===");
            acampamentos.forEach((seed) => {
                Acampamento.create(seed, (err, newCamp) =>{
                    if (err) {
                        console.log("- Erro ao adicionar acampamento: " + newCamp.name);
                    } else {
                        Comentario.create(comentario, (err, newComment) => {
                            if (err) {
                                console.log("- Erro ao criar novo comentário");
                            } else {
                                newCamp.comments.push(newComment);
                                newCamp.save();
                                console.log("- " + newCamp.name + " adicionado ao DB.");
                            }
                        })
                        
                    }
                })
            })
        }
    })
};

module.exports = seedDB;