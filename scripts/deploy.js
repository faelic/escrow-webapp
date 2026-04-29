require("dotenv").config();

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const depositor = deployer.address;
  const beneficiary = process.env.BENEFICIARY_ADDRESS;
  const arbiter = process.env.ARBITER_ADDRESS;

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(depositor, beneficiary, arbiter);

  await escrow.waitForDeployment();

  console.log("Escrow deployed to:", await escrow.getAddress());
  console.log("Depositor:", depositor);
  console.log("Beneficiary:", beneficiary);
  console.log("Arbiter:", arbiter);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
