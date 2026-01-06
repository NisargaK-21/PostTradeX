async function main() {
  const SettlementTracker = await ethers.getContractFactory("SettlementTracker");
  const contract = await SettlementTracker.deploy();

  await contract.deployed();

  console.log("SettlementTracker deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
