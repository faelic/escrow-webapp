const { expect } = require("chai");

describe("Escrow", function () {
  async function deployEscrowFixture() {
    const [deployer, beneficiary, arbiter, stranger] =
      await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(
      deployer.address,
      beneficiary.address,
      arbiter.address
    );

    await escrow.waitForDeployment();

    return { escrow, deployer, beneficiary, arbiter, stranger };
  }

  it("stores constructor roles correctly", async function () {
    const { escrow, deployer, beneficiary, arbiter } =
      await deployEscrowFixture();

    expect(await escrow.depositor()).to.equal(deployer.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.status()).to.equal(0);
  });

  it("reverts if two roles are the same", async function () {
    const [account, other] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("Escrow");

    await expect(
      Escrow.deploy(account.address, account.address, other.address)
    ).to.be.reverted;
  });

  it("allows only depositor to deposit", async function () {
    const { escrow, stranger } = await deployEscrowFixture();

    await expect(
      escrow.connect(stranger).deposit({ value: ethers.parseEther("1") })
    ).to.be.reverted;
  });

  it("reverts deposit with zero amount", async function () {
    const { escrow, deployer } = await deployEscrowFixture();

    await expect(
      escrow.connect(deployer).deposit({ value: 0 })
    ).to.be.reverted;
  });

  it("updates amount and status after deposit", async function () {
    const { escrow, deployer } = await deployEscrowFixture();

    await escrow.connect(deployer).deposit({ value: ethers.parseEther("1") });

    expect(await escrow.amount()).to.equal(ethers.parseEther("1"));
    expect(await escrow.status()).to.equal(1);
  });

  it("prevents depositing twice", async function () {
    const { escrow, deployer } = await deployEscrowFixture();
    const amount = ethers.parseEther("1");

    await escrow.connect(deployer).deposit({ value: amount });

    await expect(
      escrow.connect(deployer).deposit({ value: amount })
    ).to.be.reverted;
  });

  it("allows only arbiter to release", async function () {
    const { escrow, deployer, stranger } = await deployEscrowFixture();

    await escrow.connect(deployer).deposit({ value: ethers.parseEther("1") });

    await expect(escrow.connect(stranger).release()).to.be.reverted;
  });

  it("allows only arbiter to refund", async function () {
    const { escrow, deployer, stranger } = await deployEscrowFixture();

    await escrow.connect(deployer).deposit({ value: ethers.parseEther("1") });

    await expect(escrow.connect(stranger).refund()).to.be.reverted;
  });

  it("reverts release if escrow is not funded", async function () {
    const { escrow, arbiter } = await deployEscrowFixture();

    await expect(escrow.connect(arbiter).release()).to.be.reverted;
  });

  it("reverts refund if escrow is not funded", async function () {
    const { escrow, arbiter } = await deployEscrowFixture();

    await expect(escrow.connect(arbiter).refund()).to.be.reverted;
  });

  it("releases funds to the beneficiary and updates status", async function () {
    const { escrow, deployer, beneficiary, arbiter } =
      await deployEscrowFixture();

    const amount = ethers.parseEther("1");
    await escrow.connect(deployer).deposit({ value: amount });

    await expect(() =>
      escrow.connect(arbiter).release()
    ).to.changeEtherBalances([escrow, beneficiary], [-amount, amount]);

    expect(await escrow.status()).to.equal(2);
    expect(await escrow.amount()).to.equal(0);
  });

  it("refunds funds to the depositor and updates status", async function () {
    const { escrow, deployer, arbiter } = await deployEscrowFixture();

    const amount = ethers.parseEther("1");
    await escrow.connect(deployer).deposit({ value: amount });

    await expect(() =>
      escrow.connect(arbiter).refund()
    ).to.changeEtherBalances([escrow, deployer], [-amount, amount]);

    expect(await escrow.status()).to.equal(3);
    expect(await escrow.amount()).to.equal(0);
  });

  it("prevents refund after release", async function () {
    const { escrow, deployer, arbiter } = await deployEscrowFixture();

    await escrow.connect(deployer).deposit({ value: ethers.parseEther("1") });
    await escrow.connect(arbiter).release();

    await expect(escrow.connect(arbiter).refund()).to.be.reverted;
  });

  it("prevents release after refund", async function () {
    const { escrow, deployer, arbiter } = await deployEscrowFixture();

    await escrow.connect(deployer).deposit({ value: ethers.parseEther("1") });
    await escrow.connect(arbiter).refund();

    await expect(escrow.connect(arbiter).release()).to.be.reverted;
  });
});
